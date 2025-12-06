package WAWRO.PRE_KONSULTACJE.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "preconsultations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PreConsultation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String subject;
    private String description;
    private boolean active;
    private LocalDateTime dateCreated;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;

    @OneToMany(
            mappedBy = "preConsultation",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @OrderBy("dateCreated ASC")
    private List<Comment> comments = new ArrayList<>();


}
