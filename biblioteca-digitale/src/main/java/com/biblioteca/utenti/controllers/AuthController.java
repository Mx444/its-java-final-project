package com.biblioteca.utenti.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.biblioteca.utenti.dtos.LoginDTO;
import com.biblioteca.utenti.dtos.ResponseDTO;
import com.biblioteca.utenti.entities.Utente;
import com.biblioteca.utenti.providers.UtenteService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UtenteService utenteService;

    @PostMapping("/register")
    public ResponseDTO register(@RequestBody Utente utente) {
        return this.utenteService.register(utente);
    }

    @PostMapping("/login")
    public ResponseDTO login(@RequestBody LoginDTO loginDTO) {
        return this.utenteService.login(loginDTO);
    }
}
