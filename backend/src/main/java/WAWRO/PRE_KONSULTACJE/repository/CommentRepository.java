package WAWRO.PRE_KONSULTACJE.repository;

import WAWRO.PRE_KONSULTACJE.model.entity.Comment;
import jakarta.validation.ValidationException;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    default Comment findByIdOrThrow(long id) {
        return findById(id)
                .orElseThrow(() -> new ValidationException("Comment not found with ID: " + id));
    }

    List<Comment> findAllByPreConsultationIdAndBlockedFalse(Long preConsultationId);

    List<Comment> findAllByBlockedTrueOrderByDateCreatedDesc();
}
