package WAWRO.PRE_KONSULTACJE.repository;

import WAWRO.PRE_KONSULTACJE.model.entity.PreConsultation;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PreConsultationRepository extends JpaRepository<PreConsultation, Long> {

    default PreConsultation findByIdOrThrow(Long id) {
        return findById(id)
                .filter(PreConsultation::isActive)
                .orElseThrow(() -> new IllegalArgumentException("PreConsultation not found with ID: " + id));
    }

    List<PreConsultation> findAllByActiveTrue(Sort sort);
}
