package WAWRO.PRE_KONSULTACJE.service;

import WAWRO.PRE_KONSULTACJE.mapper.PreConsultationMapper;
import WAWRO.PRE_KONSULTACJE.model.dto.AuthorDTO;
import WAWRO.PRE_KONSULTACJE.model.dto.CommentDTO;
import WAWRO.PRE_KONSULTACJE.model.dto.PreConsultationCreateDTO;
import WAWRO.PRE_KONSULTACJE.model.dto.PreConsultationDTO;
import WAWRO.PRE_KONSULTACJE.model.entity.PreConsultation;
import WAWRO.PRE_KONSULTACJE.model.entity.User;
import WAWRO.PRE_KONSULTACJE.repository.PreConsultationRepository;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PreConsultationServiceTest {

    @Mock
    private PreConsultationRepository consultationRepository;
    @Mock
    private PreConsultationMapper consultationMapper;
    @Mock
    private UserService userService;

    @InjectMocks
    private PreConsultationService consultationService;

    private final Long CONSULTATION_ID = 5L;
    private final Long USER_ID = 10L;
    private User testUser;
    private PreConsultation testConsultation;
    private PreConsultationDTO testConsultationDTO;
    private PreConsultationCreateDTO createDTO;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(USER_ID).firstName("Test").lastName("User").build();

        createDTO = new PreConsultationCreateDTO("Nowy Temat", "Szczegółowy opis");

        testConsultation = new PreConsultation();
        testConsultation.setId(CONSULTATION_ID);
        testConsultation.setSubject("Stary Temat");
        testConsultation.setDescription("Stary Opis");
        testConsultation.setAuthor(testUser);
        testConsultation.setActive(true);
        testConsultation.setDateCreated(LocalDateTime.now());

        AuthorDTO authorDTO = new AuthorDTO("Test", "User");
        List<CommentDTO> emptyComments = Collections.emptyList();

        testConsultationDTO = new PreConsultationDTO(
                CONSULTATION_ID,
                "Stary Temat",
                "Stary Opis",
                true,
                LocalDateTime.now(),
                authorDTO,
                emptyComments
        );
    }

    @Test
    void createConsultation_shouldCallDependenciesAndReturnDTO() {
        // GIVEN
        when(userService.getLoggedUser()).thenReturn(testUser);

        when(consultationRepository.save(any(PreConsultation.class)))
                .thenReturn(testConsultation);

        when(consultationMapper.toDto(any(PreConsultation.class))).thenReturn(testConsultationDTO);

        // WHEN
        PreConsultationDTO result = consultationService.createConsultation(createDTO);

        // THEN
        assertNotNull(result);
        assertEquals(testConsultationDTO, result);

        verify(userService, times(1)).getLoggedUser();
        verify(consultationRepository, times(1)).save(argThat(consultation ->
                consultation.getSubject().equals(createDTO.subject()) &&
                        consultation.isActive() &&
                        consultation.getAuthor().getId().equals(USER_ID)
        ));
    }

    @Test
    void getConsultationById_shouldReturnDTOWhenFound() {
        // GIVEN
        when(consultationRepository.findByIdOrThrow(CONSULTATION_ID)).thenReturn(testConsultation);
        when(consultationMapper.toDto(testConsultation)).thenReturn(testConsultationDTO);

        // WHEN
        PreConsultationDTO result = consultationService.getConsultationById(CONSULTATION_ID);

        // THEN
        assertEquals(testConsultationDTO, result);
        verify(consultationRepository, times(1)).findByIdOrThrow(CONSULTATION_ID);
    }

    @Test
    void getConsultationById_shouldThrowExceptionWhenNotFound() {
        // GIVEN
        when(consultationRepository.findByIdOrThrow(CONSULTATION_ID))
                .thenThrow(new ValidationException("Consultation not found"));

        // WHEN & THEN
        assertThrows(ValidationException.class, () -> {
            consultationService.getConsultationById(CONSULTATION_ID);
        });
        verify(consultationRepository, times(1)).findByIdOrThrow(CONSULTATION_ID);
    }

    @Test
    void getAllConsultations_shouldReturnSortedActiveList() {
        // GIVEN
        PreConsultation cons1 = new PreConsultation();
        PreConsultation cons2 = new PreConsultation();
        List<PreConsultation> consultations = Arrays.asList(cons1, cons2);

        AuthorDTO authorDTO = new AuthorDTO("Test", "User");
        List<CommentDTO> emptyComments = Collections.emptyList();

        PreConsultationDTO dto1 = new PreConsultationDTO(1L, "S1", "D1", true, LocalDateTime.now(), authorDTO, emptyComments);
        PreConsultationDTO dto2 = new PreConsultationDTO(2L, "S2", "D2", true, LocalDateTime.now(), authorDTO, emptyComments);

        Sort expectedSort = Sort.by(Sort.Direction.DESC, "comments");

        when(consultationRepository.findAllByActiveTrue(expectedSort)).thenReturn(consultations);
        when(consultationMapper.toDto(cons1)).thenReturn(dto1);
        when(consultationMapper.toDto(cons2)).thenReturn(dto2);

        // WHEN
        List<PreConsultationDTO> result = consultationService.getAllConsultations();

        // THEN
        assertEquals(2, result.size());
        verify(consultationRepository, times(1)).findAllByActiveTrue(expectedSort);
    }

    @Test
    void updateConsultation_shouldUpdateSubjectAndDescription() {
        // GIVEN
        String newSubject = "Zmieniony Temat";
        String newDescription = "Zmieniony Opis";
        PreConsultationCreateDTO updateDTO = new PreConsultationCreateDTO(newSubject, newDescription);

        when(consultationRepository.findByIdOrThrow(CONSULTATION_ID)).thenReturn(testConsultation);
        when(consultationMapper.toDto(any(PreConsultation.class))).thenReturn(testConsultationDTO);

        // WHEN
        consultationService.updateConsultation(CONSULTATION_ID, updateDTO);

        // THEN
        verify(consultationRepository).save(argThat(consultation ->
                consultation.getSubject().equals(newSubject) &&
                        consultation.getDescription().equals(newDescription) &&
                        consultation.getId().equals(CONSULTATION_ID)
        ));
    }

    @Test
    void deactivateConsultation_shouldSetConsultationToInactive() {
        // GIVEN
        testConsultation.setActive(true);
        when(consultationRepository.findByIdOrThrow(CONSULTATION_ID)).thenReturn(testConsultation);

        // WHEN
        consultationService.deactivateConsultation(CONSULTATION_ID);

        // THEN
        verify(consultationRepository).save(argThat(consultation ->
                !consultation.isActive()
        ));
    }
}