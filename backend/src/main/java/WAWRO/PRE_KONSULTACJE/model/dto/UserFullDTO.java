package WAWRO.PRE_KONSULTACJE.model.dto;

import WAWRO.PRE_KONSULTACJE.model.enums.Role;

import java.time.LocalDateTime;

public record UserFullDTO(
        Long id,
        String firstName,
        String lastName,
        String email,
        String identityNumber,
        Role role,
        boolean enabled,
        LocalDateTime dateCreated
) {
}
