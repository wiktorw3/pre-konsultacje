package WAWRO.PRE_KONSULTACJE.controller;

import WAWRO.PRE_KONSULTACJE.model.dto.CommentCreateAnalogDTO;
import WAWRO.PRE_KONSULTACJE.model.dto.CommentDTO;
import WAWRO.PRE_KONSULTACJE.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

//todo use envelo solutions to scanning letters
@RestController
@RequestMapping("/api/v1/pre-consultations/analog/{consultationId}/comments")
@RequiredArgsConstructor
public class AnalogUserController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentDTO> create(@PathVariable Long consultationId,
                                             @RequestBody CommentCreateAnalogDTO createDTO) {

        CommentDTO newComment = commentService.createComment(consultationId, createDTO);
        return new ResponseEntity<>(newComment, HttpStatus.CREATED);
    }

}
