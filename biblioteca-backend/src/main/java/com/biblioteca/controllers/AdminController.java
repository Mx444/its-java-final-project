package com.biblioteca.controllers;

import com.biblioteca.dtos.LibroDTO;
import com.biblioteca.dtos.LibroStatisticaDTO;
import com.biblioteca.dtos.PrestitoDTO;
import com.biblioteca.dtos.ResponseDTO;
import com.biblioteca.providers.AdminService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@Validated
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/libri")
    public ResponseEntity<ResponseDTO> aggiungiLibro(@Valid @RequestBody LibroDTO libroDTO) {
        ResponseDTO response = adminService.aggiungiLibro(libroDTO);
        return getResponseEntity(response);
    }

    @PutMapping("/libri/{id}")
    public ResponseEntity<ResponseDTO> modificaLibro(
            @PathVariable Long id,
            @Valid @RequestBody LibroDTO libroDTO) {
        ResponseDTO response = adminService.modificaLibro(id, libroDTO);
        return getResponseEntity(response);
    }

    @DeleteMapping("/libri/{id}")
    public ResponseEntity<ResponseDTO> rimuoviLibro(@PathVariable Long id) {
        ResponseDTO response = adminService.rimuoviLibro(id);
        return getResponseEntity(response);
    }

    @GetMapping("/prestiti")
    public ResponseEntity<List<PrestitoDTO>> getTuttiPrestiti() {
        return ResponseEntity.ok(adminService.getTuttiPrestiti());
    }

    @GetMapping("/report/libri-piu-letti")
    public ResponseEntity<List<LibroStatisticaDTO>> getLibriPiuLetti() {
        return ResponseEntity.ok(adminService.getLibriPiuLetti());
    }

    private ResponseEntity<ResponseDTO> getResponseEntity(ResponseDTO response) {
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
