package WAWRO.PRE_KONSULTACJE.controller;

import WAWRO.PRE_KONSULTACJE.model.dto.CommentDTO;
import WAWRO.PRE_KONSULTACJE.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pre-consultations/moderator")
@RequiredArgsConstructor
public class ModeratorController {
    private final CommentService commentService;


    @GetMapping("/blocked")
    public ResponseEntity<List<CommentDTO>> getBlockedComments() {
        List<CommentDTO> comments = commentService.getAllBlockedCommentsSorted();
        return ResponseEntity.ok(comments);
    }

    @PatchMapping("/{commentId}/unblock")
    public ResponseEntity<CommentDTO> unblockComment(@PathVariable Long commentId) {
        CommentDTO unblockedComment = commentService.unblockComment(commentId);
        return ResponseEntity.ok(unblockedComment);
    }
}
