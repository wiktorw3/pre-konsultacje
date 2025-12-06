package WAWRO.PRE_KONSULTACJE.mapper;

import WAWRO.PRE_KONSULTACJE.model.dto.AuthorDTO;
import WAWRO.PRE_KONSULTACJE.model.dto.CommentDTO;
import WAWRO.PRE_KONSULTACJE.model.entity.Comment;
import java.time.LocalDateTime;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-06T21:53:23+0100",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.5 (Oracle Corporation)"
)
@Component
public class CommentMapperImpl implements CommentMapper {

    @Autowired
    private UserMapper userMapper;

    @Override
    public CommentDTO toDto(Comment comment) {
        if ( comment == null ) {
            return null;
        }

        AuthorDTO author = null;
        Long id = null;
        String content = null;
        LocalDateTime dateCreated = null;
        boolean blocked = false;

        author = userMapper.toAuthorDTO( comment.getAuthor() );
        id = comment.getId();
        content = comment.getContent();
        dateCreated = comment.getDateCreated();
        blocked = comment.isBlocked();

        Long approvesNumber = null;

        CommentDTO commentDTO = new CommentDTO( id, content, dateCreated, approvesNumber, author, blocked );

        return commentDTO;
    }
}
