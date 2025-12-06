package WAWRO.PRE_KONSULTACJE.model.entity;

import WAWRO.PRE_KONSULTACJE.model.enums.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String identityNumber;
    @Enumerated(EnumType.STRING)
    private Role role;
}
