package WAWRO.PRE_KONSULTACJE.mapper;

import WAWRO.PRE_KONSULTACJE.model.dto.AuthorDTO;
import WAWRO.PRE_KONSULTACJE.model.dto.UserFullDTO;
import WAWRO.PRE_KONSULTACJE.model.entity.User;
import WAWRO.PRE_KONSULTACJE.model.enums.Role;
import java.time.LocalDateTime;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-07T00:07:40+0100",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.5 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserFullDTO toDto(User user) {
        if ( user == null ) {
            return null;
        }

        Long id = null;
        String firstName = null;
        String lastName = null;
        String email = null;
        String identityNumber = null;
        Role role = null;
        boolean enabled = false;
        LocalDateTime dateCreated = null;

        id = user.getId();
        firstName = user.getFirstName();
        lastName = user.getLastName();
        email = user.getEmail();
        identityNumber = user.getIdentityNumber();
        role = user.getRole();
        enabled = user.isEnabled();
        dateCreated = user.getDateCreated();

        UserFullDTO userFullDTO = new UserFullDTO( id, firstName, lastName, email, identityNumber, role, enabled, dateCreated );

        return userFullDTO;
    }

    @Override
    public AuthorDTO toAuthorDTO(User user) {
        if ( user == null ) {
            return null;
        }

        String firstName = null;
        String lastName = null;

        firstName = user.getFirstName();
        lastName = user.getLastName();

        AuthorDTO authorDTO = new AuthorDTO( firstName, lastName );

        return authorDTO;
    }
}
