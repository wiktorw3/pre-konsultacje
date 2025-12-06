package WAWRO.PRE_KONSULTACJE.model.dto;

import jakarta.validation.constraints.NotBlank;

public record CommentCreateDTO(
        @NotBlank(message = "Content name cannot be blank")
        String content
) {
}
