package WAWRO.PRE_KONSULTACJE.controller;

import WAWRO.PRE_KONSULTACJE.model.dto.PreConsultationCreateDTO;
import WAWRO.PRE_KONSULTACJE.model.dto.PreConsultationDTO;
import WAWRO.PRE_KONSULTACJE.service.PreConsultationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pre-consultations")
@RequiredArgsConstructor
public class PreConsultationController {

    private final PreConsultationService consultationService;

    @PostMapping
    public ResponseEntity<PreConsultationDTO> create(@RequestBody PreConsultationCreateDTO createDTO) {
        PreConsultationDTO newConsultation = consultationService.createConsultation(createDTO);
        return new ResponseEntity<>(newConsultation, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<PreConsultationDTO>> getAll() {
        List<PreConsultationDTO> consultations = consultationService.getAllConsultations();
        return ResponseEntity.ok(consultations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PreConsultationDTO> getById(@PathVariable Long id) {
        PreConsultationDTO consultation = consultationService.getConsultationById(id);
        return ResponseEntity.ok(consultation);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PreConsultationDTO> update(@PathVariable Long id,
                                                     @RequestBody PreConsultationCreateDTO updateDTO) {
        PreConsultationDTO updatedConsultation = consultationService.updateConsultation(id, updateDTO);
        return ResponseEntity.ok(updatedConsultation);
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deactivate(@PathVariable Long id) {
        consultationService.deactivateConsultation(id);
    }
}
