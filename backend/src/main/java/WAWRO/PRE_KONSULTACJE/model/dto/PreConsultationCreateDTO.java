package WAWRO.PRE_KONSULTACJE.model.dto;


import jakarta.validation.constraints.NotBlank;

public record PreConsultationCreateDTO(

        @NotBlank(message = "Subject name cannot be blank")
        String subject,
        @NotBlank(message = "Description name cannot be blank")
        String description

) {
}
