package WAWRO.PRE_KONSULTACJE.controller;


import WAWRO.PRE_KONSULTACJE.model.dto.CommentCreateDTO;
import WAWRO.PRE_KONSULTACJE.model.dto.CommentDTO;
import WAWRO.PRE_KONSULTACJE.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pre-consultations/{consultationId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentDTO> create(@PathVariable Long consultationId,
                                             @RequestBody CommentCreateDTO createDTO) {

        CommentDTO newComment = commentService.createComment(consultationId, createDTO);
        return new ResponseEntity<>(newComment, HttpStatus.CREATED);
    }


    @GetMapping
    public ResponseEntity<List<CommentDTO>> getAllByConsultation(@PathVariable Long consultationId) {

        List<CommentDTO> comments = commentService.getActiveCommentsByConsultationId(consultationId);
        return ResponseEntity.ok(comments);
    }

    @PatchMapping("/{commentId}/block")
    public ResponseEntity<CommentDTO> toggleBlockStatus(@PathVariable Long consultationId,
                                                        @PathVariable Long commentId
    ) {
        CommentDTO updatedComment = commentService.toggleBlockStatus(commentId);
        return ResponseEntity.ok(updatedComment);
    }


    @PostMapping("/{commentId}/approve")
    public ResponseEntity<CommentDTO> toggleApprove(
            @PathVariable Long consultationId,
            @PathVariable Long commentId) {

        CommentDTO updatedComment = commentService.toggleApprove(commentId);

        return ResponseEntity.ok(updatedComment);
    }
}
