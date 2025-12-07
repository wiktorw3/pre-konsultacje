package WAWRO.PRE_KONSULTACJE.model.dto;

import jakarta.validation.constraints.NotBlank;

public record CommentCreateAnalogDTO(
        @NotBlank(message = "Content name cannot be blank")
        String content,
        @NotBlank(message = "Firstname name cannot be blank")
        String firstName,
        @NotBlank(message = "LastName name cannot be blank")
        String lastName
) {
}
