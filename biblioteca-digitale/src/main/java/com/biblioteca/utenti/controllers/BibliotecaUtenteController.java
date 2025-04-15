package com.biblioteca.utenti.controllers;

import com.biblioteca.libri.entities.Libro;
import com.biblioteca.prestiti.dtos.PrestitoDTO;
import com.biblioteca.utenti.dtos.ResponseDTO;
import com.biblioteca.utenti.providers.BibliotecaUtenteService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class BibliotecaUtenteController {

    @Autowired
    private BibliotecaUtenteService bibliotecaUtenteService;

    @GetMapping("/libri")
    public List<Libro> getAllLibri() {
        return bibliotecaUtenteService.getAllLibri();
    }

    @PostMapping("/prestiti")
    public ResponseDTO creaPrestito(@RequestBody Long idLibro) {
        return bibliotecaUtenteService.creaPrestito(idLibro);
    }

    @PostMapping("/restituisci/{id}")
    public ResponseDTO restituisciLibro(@PathVariable Long id) {
        return bibliotecaUtenteService.restituisciLibro(id);
    }

    @GetMapping("/miei-prestiti")
    public List<PrestitoDTO> getMieiPrestiti() {
        return bibliotecaUtenteService.getMieiPrestiti();
    }
}