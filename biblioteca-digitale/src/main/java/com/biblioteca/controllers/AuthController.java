package com.biblioteca.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.biblioteca.providers.UtenteService;
import com.biblioteca.controllers.dtos.AuthRequest;
import com.biblioteca.entities.Utente;

@RestController
@RequestMapping("/auth")
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
