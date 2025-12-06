package WAWRO.PRE_KONSULTACJE.model.dto;

import java.time.LocalDateTime;

public record CommentDTO(
        Long id,
        String content,
        LocalDateTime dateCreated,
        Long approvesNumber,
        AuthorDTO author,
        boolean blocked
) {
}
