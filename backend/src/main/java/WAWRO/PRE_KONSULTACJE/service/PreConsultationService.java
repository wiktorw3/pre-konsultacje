package WAWRO.PRE_KONSULTACJE.service;

import WAWRO.PRE_KONSULTACJE.mapper.PreConsultationMapper;
import WAWRO.PRE_KONSULTACJE.model.dto.PreConsultationCreateDTO;
import WAWRO.PRE_KONSULTACJE.model.dto.PreConsultationDTO;
import WAWRO.PRE_KONSULTACJE.model.entity.PreConsultation;
import WAWRO.PRE_KONSULTACJE.model.entity.User;
import WAWRO.PRE_KONSULTACJE.repository.PreConsultationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PreConsultationService {

    private final PreConsultationRepository consultationRepository;
    private final PreConsultationMapper consultationMapper;
    private final UserService userService;

    @Transactional
    public PreConsultationDTO createConsultation(PreConsultationCreateDTO createDTO) {

        User author = userService.getLoggedUser();

        PreConsultation consultation = new PreConsultation();
        consultation.setSubject(createDTO.subject());
        consultation.setDescription(createDTO.description());
        consultation.setAuthor(author);
        consultation.setActive(true);
        consultation.setDateCreated(LocalDateTime.now());

        PreConsultation savedConsultation = consultationRepository.save(consultation);
        return consultationMapper.toDto(savedConsultation);
    }

    @Transactional(readOnly = true)
    public PreConsultationDTO getConsultationById(Long id) {
        PreConsultation consultation = consultationRepository.findByIdOrThrow(id);
        return consultationMapper.toDto(consultation);
    }

    @Transactional(readOnly = true)
    public List<PreConsultationDTO> getAllConsultations() {
        return consultationRepository.findAllByActiveTrue().stream()
                .map(consultationMapper::toDto)
                .collect(Collectors.toList());
    }
    @Transactional
    public PreConsultationDTO updateConsultation(Long id, PreConsultationCreateDTO updateDTO) {

        PreConsultation consultation = consultationRepository.findByIdOrThrow(id);
        consultation.setSubject(updateDTO.subject());
        consultation.setDescription(updateDTO.description());
        consultationRepository.save(consultation);

        return consultationMapper.toDto(consultation);
    }

    @Transactional
    public void deactivateConsultation(Long id) {

        PreConsultation consultation = consultationRepository.findByIdOrThrow(id);
        consultation.setActive(false);
        consultationRepository.save(consultation);
    }
}
