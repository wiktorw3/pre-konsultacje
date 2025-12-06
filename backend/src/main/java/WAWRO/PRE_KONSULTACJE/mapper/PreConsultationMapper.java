package WAWRO.PRE_KONSULTACJE.mapper;

import WAWRO.PRE_KONSULTACJE.model.dto.PreConsultationDTO;
import WAWRO.PRE_KONSULTACJE.model.entity.PreConsultation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
        componentModel = "spring",
        uses = {UserMapper.class, CommentMapper.class}
)
public interface PreConsultationMapper {


    @Mapping(target = "author", source = "author", qualifiedByName = "toAuthorDTO")
    PreConsultationDTO toDto(PreConsultation consultation);


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateCreated", ignore = true)
    @Mapping(target = "comments", ignore = true)
    PreConsultation toEntity(PreConsultationDTO consultationDTO);
}
