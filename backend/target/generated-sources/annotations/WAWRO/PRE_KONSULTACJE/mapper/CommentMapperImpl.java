package WAWRO.PRE_KONSULTACJE.mapper;

import WAWRO.PRE_KONSULTACJE.model.dto.AuthorDTO;
import WAWRO.PRE_KONSULTACJE.model.dto.CommentDTO;
import WAWRO.PRE_KONSULTACJE.model.entity.Comment;
import WAWRO.PRE_KONSULTACJE.model.entity.User;
import java.time.LocalDateTime;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-06T23:13:04+0100",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.5 (Oracle Corporation)"
)
@Component
public class CommentMapperImpl implements CommentMapper {

    @Override
    public CommentDTO toDto(Comment comment) {
        if ( comment == null ) {
            return null;
        }

        Long approvesNumber = null;
        Long id = null;
        String content = null;
        LocalDateTime dateCreated = null;
        AuthorDTO author = null;
        boolean blocked = false;

        approvesNumber = mapApprovesNumber( comment.getApproves() );
        id = comment.getId();
        content = comment.getContent();
        dateCreated = comment.getDateCreated();
        author = userToAuthorDTO( comment.getAuthor() );
        blocked = comment.isBlocked();

        CommentDTO commentDTO = new CommentDTO( id, content, dateCreated, approvesNumber, author, blocked );

        return commentDTO;
    }

    protected AuthorDTO userToAuthorDTO(User user) {
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
