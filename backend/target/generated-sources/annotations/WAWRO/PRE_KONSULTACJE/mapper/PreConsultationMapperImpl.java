package WAWRO.PRE_KONSULTACJE.mapper;

import WAWRO.PRE_KONSULTACJE.model.dto.AuthorDTO;
import WAWRO.PRE_KONSULTACJE.model.dto.CommentDTO;
import WAWRO.PRE_KONSULTACJE.model.dto.PreConsultationDTO;
import WAWRO.PRE_KONSULTACJE.model.entity.Comment;
import WAWRO.PRE_KONSULTACJE.model.entity.PreConsultation;
import WAWRO.PRE_KONSULTACJE.model.entity.User;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-06T21:53:23+0100",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.5 (Oracle Corporation)"
)
@Component
public class PreConsultationMapperImpl implements PreConsultationMapper {

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private CommentMapper commentMapper;

    @Override
    public PreConsultationDTO toDto(PreConsultation consultation) {
        if ( consultation == null ) {
            return null;
        }

        AuthorDTO author = null;
        Long id = null;
        String subject = null;
        String description = null;
        boolean active = false;
        LocalDateTime dateCreated = null;
        List<CommentDTO> comments = null;

        author = userMapper.toAuthorDTO( consultation.getAuthor() );
        id = consultation.getId();
        subject = consultation.getSubject();
        description = consultation.getDescription();
        active = consultation.isActive();
        dateCreated = consultation.getDateCreated();
        comments = commentListToCommentDTOList( consultation.getComments() );

        PreConsultationDTO preConsultationDTO = new PreConsultationDTO( id, subject, description, active, dateCreated, author, comments );

        return preConsultationDTO;
    }

    @Override
    public PreConsultation toEntity(PreConsultationDTO consultationDTO) {
        if ( consultationDTO == null ) {
            return null;
        }

        PreConsultation.PreConsultationBuilder preConsultation = PreConsultation.builder();

        preConsultation.subject( consultationDTO.subject() );
        preConsultation.description( consultationDTO.description() );
        preConsultation.active( consultationDTO.active() );
        preConsultation.author( authorDTOToUser( consultationDTO.author() ) );

        return preConsultation.build();
    }

    protected List<CommentDTO> commentListToCommentDTOList(List<Comment> list) {
        if ( list == null ) {
            return null;
        }

        List<CommentDTO> list1 = new ArrayList<CommentDTO>( list.size() );
        for ( Comment comment : list ) {
            list1.add( commentMapper.toDto( comment ) );
        }

        return list1;
    }

    protected User authorDTOToUser(AuthorDTO authorDTO) {
        if ( authorDTO == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.firstName( authorDTO.firstName() );
        user.lastName( authorDTO.lastName() );

        return user.build();
    }
}
