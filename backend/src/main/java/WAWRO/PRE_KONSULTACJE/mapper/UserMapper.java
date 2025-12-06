package WAWRO.PRE_KONSULTACJE.mapper;

import WAWRO.PRE_KONSULTACJE.model.dto.AuthorDTO;
import WAWRO.PRE_KONSULTACJE.model.dto.UserFullDTO;
import WAWRO.PRE_KONSULTACJE.model.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserFullDTO toDto(User user);

    @Named("toAuthorDTO")
    AuthorDTO toAuthorDTO(User user);
}
