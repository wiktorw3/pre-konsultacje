package WAWRO.PRE_KONSULTACJE.repository;

import WAWRO.PRE_KONSULTACJE.model.entity.User;
import jakarta.validation.ValidationException;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    default User findByIdOrThrow(long id) {
        return findById(id)
                .orElseThrow(() -> new ValidationException("User not found with ID: " + id));
    }

    Optional<User> getByEmail(String email);
}
