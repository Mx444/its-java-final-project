package com.biblioteca.utenti.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.biblioteca.utenti.controllers.dtos.AuthRequest;
import com.biblioteca.utenti.entities.Utente;
import com.biblioteca.utenti.providers.UtenteService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UtenteService utenteService;

    @PostMapping("/register")
    public String register(@RequestBody Utente utente) {
        return this.utenteService.register(utente);
    }

    @PostMapping("/login")
    public String login(@RequestBody AuthRequest authRequest) {
        return this.utenteService.login(authRequest);

    }
}
