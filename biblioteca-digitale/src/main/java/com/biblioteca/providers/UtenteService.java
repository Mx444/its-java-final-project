package com.biblioteca.providers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.biblioteca.entities.Utente;
import com.biblioteca.repositories.UtenteRepository;

@Service
public class UtenteService {
    private final UtenteRepository utentiRepository;

    @Autowired
    public UtenteService(UtenteRepository utentiRepository) {
        this.utentiRepository = utentiRepository;
    }

    public String register(Utente utente) {
        Boolean userExist = this.utentiRepository.existsByEmail(utente.getEmail());
        if (userExist)
            return "Email già esistente !";
        this.utentiRepository.save(utente);
        return "Registrazione avvenuta con successo !";
    }
}
