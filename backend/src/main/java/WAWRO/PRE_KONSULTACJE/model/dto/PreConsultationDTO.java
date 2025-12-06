package WAWRO.PRE_KONSULTACJE.model.dto;

import java.time.LocalDateTime;
import java.util.List;

public record PreConsultationDTO(
        Long id,
        String subject,
        String description,
        boolean active,
        LocalDateTime dateCreated,
        AuthorDTO author,
        List<CommentDTO> comments
) {
}
