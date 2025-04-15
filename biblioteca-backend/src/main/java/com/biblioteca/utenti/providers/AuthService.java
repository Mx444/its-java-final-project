package com.biblioteca.utenti.providers;

import java.util.regex.Pattern;

import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.biblioteca.utenti.dtos.LoginDTO;
import com.biblioteca.utenti.dtos.ResponseDTO;
import com.biblioteca.utenti.entities.Utente;
import com.biblioteca.utenti.entities.enums.Ruoli;
import com.biblioteca.security.JwtUtil;
import com.biblioteca.utenti.repositories.UtenteRepository;

@Service
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private final UtenteRepository utenteRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthService(UtenteRepository utenteRepository, JwtUtil jwtUtil) {
        this.utenteRepository = utenteRepository;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public ResponseDTO register(Utente utente) {
        ResponseDTO validationResponse = validateRegistrationData(utente);
        if (!validationResponse.isSuccess())
            return validationResponse;
        if (utenteRepository.existsByEmail(utente.getEmail())) {
            logger.warn("Email già esistente: " + utente.getEmail());
            return new ResponseDTO(false, "Email già esistente!");
        }
        try {
            utenteRepository.save(utente);
            logger.info("Registrazione avvenuta con successo per l'utente: " + utente.getNome());
            return new ResponseDTO(true, "Registrazione avvenuta con successo!");
        } catch (Exception e) {
            logger.error("Errore durante la registrazione dell'utente: " + utente.getNome(), e);
            return new ResponseDTO(false, "Errore durante la registrazione!");
        }

    }

    @Transactional(readOnly = true)
    public ResponseDTO login(LoginDTO loginDTO) {
        if (loginDTO.email == null || loginDTO.password == null) {
            return new ResponseDTO(false, "Dati di accesso incompleti");
        }
        try {
            Utente utente = this.utenteRepository.findByEmail(loginDTO.email).orElse(null);
            if (utente == null) {
                logger.warn("Email non esiste :", loginDTO.email);
                return new ResponseDTO(false, "Credenziali errate!");
            }
            if (!utente.comparePassword(loginDTO.password)) {
                logger.warn("Password errata :", loginDTO.email);
                return new ResponseDTO(false, "Credenziali errate!");
            }
            String token = jwtUtil.generateToken(utente);
            logger.info("Login avvenuto con successo :", loginDTO.email);
            return new ResponseDTO(true, "Login avvenuto con successo!", token);
        } catch (Exception e) {
            logger.error("Errore durante il login", e);
            return new ResponseDTO(false, "Errore durante il login!");
        }
    }

    private ResponseDTO validateRegistrationData(Utente utente) {
        Pattern EMAIL_PATTERN = Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$",
                Pattern.CASE_INSENSITIVE);
        int MIN_PASSWORD_LENGTH = 8;
        if (utente.getNome() == null || utente.getNome().trim().isEmpty())
            return new ResponseDTO(false, "Nome non valido!");
        if (utente.getEmail() == null || !EMAIL_PATTERN.matcher(utente.getEmail()).matches())
            return new ResponseDTO(false, "Formato email non valido!");
        if (utente.getPassword() == null || utente.getPassword().length() < MIN_PASSWORD_LENGTH) {
            return new ResponseDTO(false, "La password deve contenere almeno " + MIN_PASSWORD_LENGTH + " caratteri!",
                    null);
        }
        if (utente.getRuolo() == null)
            return new ResponseDTO(false, "Ruolo non specificato!");
        try {
            Ruoli role = Ruoli.valueOf(utente.getRuolo().toString());
            if (role != Ruoli.ROLE_USER && role != Ruoli.ROLE_ADMIN)
                return new ResponseDTO(false, "Ruolo non valido!");
        } catch (IllegalArgumentException e) {
            return new ResponseDTO(false, "Ruolo non valido!");
        }
        return new ResponseDTO(true, "");
    }
}
