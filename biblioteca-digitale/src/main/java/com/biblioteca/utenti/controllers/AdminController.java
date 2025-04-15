package com.biblioteca.utenti.controllers;

import com.biblioteca.libri.dtos.LibroStatisticaDTO;
import com.biblioteca.utenti.providers.AdminService;
import com.biblioteca.libri.entities.Libro;
import com.biblioteca.prestiti.dtos.PrestitoDTO;
import com.biblioteca.utenti.dtos.ResponseDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/libri")
    public ResponseDTO aggiungiLibro(@RequestBody Libro libro) {
        return adminService.aggiungiLibro(libro);
    }

    @PutMapping("/libri/{id}")
    public ResponseDTO modificaLibro(@PathVariable Long id, @RequestBody Libro libro) {
        return adminService.modificaLibro(id, libro);
    }

    @DeleteMapping("/libri/{id}")
    public ResponseDTO rimuoviLibro(@PathVariable Long id) {
        return adminService.rimuoviLibro(id);
    }

    @GetMapping("/prestiti")
    public List<PrestitoDTO> getTuttiPrestiti() {
        return adminService.getTuttiPrestiti();
    }

    @GetMapping("/report/libri-piu-letti")
    public List<LibroStatisticaDTO> getLibriPiuLetti() {
        return adminService.getLibriPiuLetti();
    }
}