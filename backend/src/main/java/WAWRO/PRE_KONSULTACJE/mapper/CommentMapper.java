package WAWRO.PRE_KONSULTACJE.mapper;

import WAWRO.PRE_KONSULTACJE.model.dto.CommentDTO;
import WAWRO.PRE_KONSULTACJE.model.entity.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Optional;
import java.util.Set;

@Mapper(
        componentModel = "spring",
        uses = {UserMapper.class}
)
public interface CommentMapper {


    @Mapping(target = "approvesNumber", source = "approves", qualifiedByName = "mapApprovesNumber")
    CommentDTO toDto(Comment comment);

    @Named("mapApprovesNumber")
    default Long mapApprovesNumber(Set<Long> approves) {
        return Optional.ofNullable(approves)
                .map(Set::size)
                .map(Integer::longValue)
                .orElse(0L);
    }
}