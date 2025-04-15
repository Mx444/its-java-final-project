package com.biblioteca.utenti.controllers;

import com.biblioteca.libri.entities.Libro;
import com.biblioteca.prestiti.dtos.PrestitoDTO;
import com.biblioteca.utenti.dtos.ResponseDTO;
import com.biblioteca.utenti.providers.UtenteService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UtenteController {

    @Autowired
    private UtenteService utenteService;

    @GetMapping("/libri")
    public List<Libro> getAllLibri() {
        return utenteService.getAllLibri();
    }

    @PostMapping("/prestiti")
    public ResponseDTO creaPrestito(@RequestBody Long idLibro) {
        return utenteService.creaPrestito(idLibro);
    }

    @PostMapping("/restituisci/{id}")
    public ResponseDTO restituisciLibro(@PathVariable Long id) {
        return utenteService.restituisciLibro(id);
    }

    @GetMapping("/miei-prestiti")
    public List<PrestitoDTO> getMieiPrestiti() {
        return utenteService.getMieiPrestiti();
    }
}