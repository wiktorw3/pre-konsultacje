package WAWRO.PRE_KONSULTACJE.model.entity;

import WAWRO.PRE_KONSULTACJE.model.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

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
    private boolean enabled;
    private LocalDateTime dateCreated;

    @OneToMany(
            mappedBy = "author",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private Set<PreConsultation> preConsultations = new HashSet<>();
}
