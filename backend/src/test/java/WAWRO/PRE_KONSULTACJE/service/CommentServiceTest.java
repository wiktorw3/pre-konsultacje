package WAWRO.PRE_KONSULTACJE.service;

import WAWRO.PRE_KONSULTACJE.mapper.CommentMapper;
import WAWRO.PRE_KONSULTACJE.model.dto.CommentCreateAnalogDTO;
import WAWRO.PRE_KONSULTACJE.model.dto.CommentCreateDTO;
import WAWRO.PRE_KONSULTACJE.model.dto.CommentDTO;
import WAWRO.PRE_KONSULTACJE.model.entity.Comment;
import WAWRO.PRE_KONSULTACJE.model.entity.PreConsultation;
import WAWRO.PRE_KONSULTACJE.model.entity.User;
import WAWRO.PRE_KONSULTACJE.repository.CommentRepository;
import WAWRO.PRE_KONSULTACJE.repository.PreConsultationRepository;
import WAWRO.PRE_KONSULTACJE.utils.AiService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.HashSet;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;
    @Mock
    private PreConsultationRepository preConsultationRepository;
    @Mock
    private CommentMapper commentMapper;
    @Mock
    private UserService userService;
    @Mock
    private AiService aiService;

    @InjectMocks
    private CommentService commentService;

    private final Long CONSULTATION_ID = 1L;
    private final Long COMMENT_ID = 10L;
    private final Long USER_ID = 100L;
    private User testUser;
    private PreConsultation testConsultation;
    private Comment testComment;
    private CommentDTO testCommentDTO;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(USER_ID).firstName("Jan").lastName("Kowalski").build();
        testConsultation = new PreConsultation();
        testConsultation.setId(CONSULTATION_ID);

        testComment = new Comment();
        testComment.setId(COMMENT_ID);
        testComment.setContent("Testowa treść");
        testComment.setAuthor(testUser);
        testComment.setPreConsultation(testConsultation);
        testComment.setDateCreated(LocalDateTime.now());
        testComment.setBlocked(false);
        testComment.setApproves(new HashSet<>());

        testCommentDTO = new CommentDTO(COMMENT_ID, "Testowa treść", LocalDateTime.now(), null, null, false);
    }


    @Test
    void createComment_shouldCreateAndBlockIfValidationFails() {
        // GIVEN
        CommentCreateDTO createDTO = new CommentCreateDTO("Zła treść");

        when(userService.getLoggedUser()).thenReturn(testUser);
        when(preConsultationRepository.findByIdOrThrow(CONSULTATION_ID)).thenReturn(testConsultation);
        when(aiService.validateComment("Zła treść")).thenReturn("SPAM");
        doAnswer(invocation -> {
            Comment comment = new Comment();
            comment.setAuthor(testUser);
            comment.setPreConsultation(testConsultation);
            comment.setDateCreated(LocalDateTime.now());
            return comment;
        }).when(commentRepository).save(any(Comment.class));

        when(commentMapper.toDto(any(Comment.class))).thenReturn(testCommentDTO);

        // WHEN
        CommentDTO result = commentService.createComment(CONSULTATION_ID, createDTO);

        // THEN
        verify(commentRepository).save(argThat(comment ->
                comment.isBlocked() && comment.getContent().equals("Zła treść")
        ));
        assertEquals(testCommentDTO, result);
    }

    @Test
    void createComment_shouldCreateAndNotBlockIfValidationSucceeds() {
        // GIVEN
        CommentCreateDTO createDTO = new CommentCreateDTO("Dobra treść");

        when(userService.getLoggedUser()).thenReturn(testUser);
        when(preConsultationRepository.findByIdOrThrow(CONSULTATION_ID)).thenReturn(testConsultation);
        when(aiService.validateComment("Dobra treść")).thenReturn("OK");

        lenient().when(commentRepository.save(any(Comment.class))).thenReturn(testComment);
        lenient().when(commentMapper.toDto(any(Comment.class))).thenReturn(testCommentDTO);
        // WHEN
        commentService.createComment(CONSULTATION_ID, createDTO);

        // THEN
        verify(commentRepository).save(argThat(comment ->
                !comment.isBlocked()
        ));
    }

    @Test
    void createCommentAnalog_shouldCreateUserAndComment() {
        // GIVEN
        CommentCreateAnalogDTO createDTO = new CommentCreateAnalogDTO("Anonim", "Anonimowski", "Dobra treść");
        User analogUser = User.builder().id(999L).build();

        when(userService.createAnalogUser(anyString(), anyString())).thenReturn(analogUser);

        when(preConsultationRepository.findByIdOrThrow(CONSULTATION_ID)).thenReturn(testConsultation);
        when(aiService.validateComment(anyString())).thenReturn("OK");

        when(commentRepository.save(any(Comment.class))).thenReturn(testComment);
        when(commentMapper.toDto(any(Comment.class))).thenReturn(testCommentDTO);

        // WHEN
        commentService.createComment(CONSULTATION_ID, createDTO);

        // THEN

        verify(commentRepository).save(argThat(comment ->
                comment.getAuthor().getId().equals(999L) && !comment.isBlocked()
        ));
    }

    @Test
    void unblockComment_shouldSetBlockedToFalse() {
        // GIVEN
        testComment.setBlocked(true);
        Comment unblockedComment = testComment;
        unblockedComment.setBlocked(false);

        when(commentRepository.findByIdOrThrow(COMMENT_ID)).thenReturn(testComment);
        when(commentRepository.save(any(Comment.class))).thenReturn(unblockedComment);
        when(commentMapper.toDto(any(Comment.class))).thenReturn(testCommentDTO);

        // WHEN
        commentService.unblockComment(COMMENT_ID);

        // THEN
        verify(commentRepository).save(argThat(comment ->
                !comment.isBlocked()
        ));
    }

    @Test
    void getActiveCommentsByConsultationId_shouldReturnActiveComments() {
        // GIVEN
        Comment activeComment = new Comment();
        activeComment.setBlocked(false);
        List<Comment> activeComments = Arrays.asList(activeComment, new Comment());

        when(commentRepository.findAllByPreConsultationIdAndBlockedFalse(CONSULTATION_ID)).thenReturn(activeComments);
        when(commentMapper.toDto(any(Comment.class))).thenReturn(testCommentDTO);

        // WHEN
        List<CommentDTO> result = commentService.getActiveCommentsByConsultationId(CONSULTATION_ID);

        // THEN
        assertEquals(2, result.size());
        verify(commentRepository).findAllByPreConsultationIdAndBlockedFalse(CONSULTATION_ID);
        verify(commentMapper, times(2)).toDto(any(Comment.class));
    }

    @Test
    void getAllBlockedCommentsSorted_shouldReturnBlockedComments() {
        // GIVEN
        Comment blocked1 = new Comment();
        blocked1.setBlocked(true);
        List<Comment> blockedComments = Arrays.asList(blocked1, new Comment());

        when(commentRepository.findAllByBlockedTrueOrderByDateCreatedDesc()).thenReturn(blockedComments);
        when(commentMapper.toDto(any(Comment.class))).thenReturn(testCommentDTO);

        // WHEN
        List<CommentDTO> result = commentService.getAllBlockedCommentsSorted();

        // THEN
        assertEquals(2, result.size());
        verify(commentRepository).findAllByBlockedTrueOrderByDateCreatedDesc();
    }

    @Test
    void toggleApprove_shouldAddApproveIfNotFound() {
        // GIVEN
        when(userService.getLoggedUser()).thenReturn(testUser);
        when(commentRepository.findByIdOrThrow(COMMENT_ID)).thenReturn(testComment);
        testComment.setApproves(new HashSet<>(Collections.singletonList(200L)));
        // WHEN
        commentService.toggleApprove(COMMENT_ID);

        // THEN
        verify(commentRepository).save(argThat(comment ->
                comment.getApproves().contains(USER_ID) && comment.getApproves().size() == 2
        ));
    }

    @Test
    void toggleApprove_shouldRemoveApproveIfFound() {
        // GIVEN
        when(userService.getLoggedUser()).thenReturn(testUser);
        when(commentRepository.findByIdOrThrow(COMMENT_ID)).thenReturn(testComment);
        testComment.setApproves(new HashSet<>(Collections.singletonList(USER_ID)));

        // WHEN
        commentService.toggleApprove(COMMENT_ID);

        // THEN
        verify(commentRepository).save(argThat(comment ->
                !comment.getApproves().contains(USER_ID) && comment.getApproves().isEmpty()
        ));
    }
}
