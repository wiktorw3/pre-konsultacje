package WAWRO.PRE_KONSULTACJE.mapper;

import WAWRO.PRE_KONSULTACJE.model.dto.CommentDTO;
import WAWRO.PRE_KONSULTACJE.model.entity.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Set;

@Mapper(
        componentModel = "spring",
        uses = {UserMapper.class}
)
public interface CommentMapper {


    @Mapping(target = "author", source = "author", qualifiedByName = "toAuthorDTO")
    CommentDTO toDto(Comment comment);

    default Long mapApprovesNumber(Set<Long> approves) {
        return approves != null ? (long) approves.size() : 0L;
    }
}