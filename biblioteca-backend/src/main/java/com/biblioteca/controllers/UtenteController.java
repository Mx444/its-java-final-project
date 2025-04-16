package com.biblioteca.controllers;

import com.biblioteca.dtos.PrestitoDTO;
import com.biblioteca.dtos.PrestitoRequestDTO;
import com.biblioteca.dtos.ResponseDTO;
import com.biblioteca.dtos.RestituzioneDato;
import com.biblioteca.models.Libro;
import com.biblioteca.providers.UtenteService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/user")
@Validated
public class UtenteController {

    private final UtenteService utenteService;

    public UtenteController(UtenteService utenteService) {
        this.utenteService = utenteService;
    }

    @GetMapping("/libri")
    public ResponseEntity<List<Libro>> getAllLibri() {
        return ResponseEntity.ok(utenteService.getAllLibri());
    }

    @PostMapping("/prestiti")
    public ResponseEntity<ResponseDTO> creaPrestito(@Valid @RequestBody PrestitoRequestDTO prestitoRequest) {
        ResponseDTO response = utenteService.creaPrestito(prestitoRequest);
        return getResponseEntity(response);
    }

    @PostMapping("/restituisci/{id}")
    public ResponseDTO restituisciLibro(@PathVariable Long id) {
        return utenteService.restituisciLibro(id);
    }

    @GetMapping("/miei-prestiti")
    public ResponseEntity<List<PrestitoDTO>> getMieiPrestiti() {
        return ResponseEntity.ok(utenteService.getMieiPrestiti());
    }

    private ResponseEntity<ResponseDTO> getResponseEntity(ResponseDTO response) {
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}