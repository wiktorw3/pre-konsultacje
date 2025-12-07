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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PreConsultationRepository preConsultationRepository;
    private final CommentMapper commentMapper;
    private final UserService userService;
    private final AiService aiService;


    @Transactional
    public CommentDTO createComment(Long consultationId, CommentCreateDTO createDTO) {

        User author = userService.getLoggedUser();
        Comment comment = buildComment(author,consultationId);
        comment.setContent(createDTO.content());
        //comment.setBlocked(!validateContent(createDTO.content()));
        Comment savedComment = commentRepository.save(comment);
        return commentMapper.toDto(savedComment);
    }

    @Transactional
    public CommentDTO createComment(Long consultationId, CommentCreateAnalogDTO createDTO) {

        User author = userService.createAnalogUser(createDTO.firstName(), createDTO.lastName());
        Comment comment = buildComment(author,consultationId);
        comment.setContent(createDTO.content());
        //todo uncoment when ai service works
        //comment.setBlocked(!validateContent(createDTO.content()));
        Comment savedComment = commentRepository.save(comment);
        return commentMapper.toDto(savedComment);
    }

    private Comment buildComment (User author, Long consultationId) {
        PreConsultation consultation = preConsultationRepository.findByIdOrThrow(consultationId);

        Comment comment = new Comment();
        comment.setAuthor(author);
        comment.setPreConsultation(consultation);
        comment.setDateCreated(LocalDateTime.now());
        return comment;
    }

    private boolean validateContent(String content) {
        return aiService.validateComment(content).equals("OK");
    }

    @Transactional
    public CommentDTO unblockComment(Long commentId) {
        Comment comment = commentRepository.findByIdOrThrow(commentId);
        comment.setBlocked(false);
        Comment savedComment = commentRepository.save(comment);
        return commentMapper.toDto(savedComment);
    }

    @Transactional(readOnly = true)
    public List<CommentDTO> getActiveCommentsByConsultationId(Long consultationId) {
        return commentRepository.findAllByPreConsultationIdAndBlockedFalse(consultationId).stream()
                .map(commentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CommentDTO> getAllBlockedCommentsSorted() {
        return commentRepository.findAllByBlockedTrueOrderByDateCreatedDesc().stream()
                .map(commentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentDTO toggleBlockStatus(Long commentId) {
        Comment comment = commentRepository.findByIdOrThrow(commentId);
        comment.setBlocked(true);
        commentRepository.save(comment);
        return commentMapper.toDto(comment);
    }

    @Transactional
    public CommentDTO toggleApprove(Long commentId) {
        User user = userService.getLoggedUser();
        Comment comment = commentRepository.findByIdOrThrow(commentId);
        Set<Long> approves = comment.getApproves();

        if (approves.contains(user.getId())) {
            approves.remove(user.getId());
        } else {
            approves.add(user.getId());
        }
        commentRepository.save(comment);
        return commentMapper.toDto(comment);
    }

}
