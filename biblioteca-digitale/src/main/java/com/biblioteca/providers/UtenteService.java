package com.biblioteca.providers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.biblioteca.controllers.dtos.AuthRequest;
import com.biblioteca.entities.Utente;
import com.biblioteca.repositories.UtenteRepository;
import com.biblioteca.security.JwtUtil;

@Service
public class UtenteService {
    @Autowired
    private final UtenteRepository utentiRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public UtenteService(UtenteRepository utentiRepository, JwtUtil jwtUtil) {
        this.utentiRepository = utentiRepository;
        this.jwtUtil = jwtUtil;
    }

    public String register(Utente utente) {
        try {
            Boolean userExist = this.utentiRepository.existsByEmail(utente.getEmail());
            if (userExist)
                return "Email già esistente !";
            this.utentiRepository.save(utente);
            return "Registrazione avvenuta con successo !";
        } catch (Exception e) {
            return "Errore durante la registrazione !";
        }

    }

    public String login(AuthRequest authRequest) {
        try {
            Utente utente = this.utentiRepository.findByEmail(authRequest.email).orElse(null);
            if (utente == null)
                return "Email non esistente !";
            if (!utente.comparePassword(authRequest.password))
                return "Password errata !";
            String token = jwtUtil.generateToken(utente);
            return token;
        } catch (Exception e) {
            return "Errore durante il login !";
        }
    }

}
