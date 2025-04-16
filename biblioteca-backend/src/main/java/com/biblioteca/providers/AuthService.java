package com.biblioteca.providers;

import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.biblioteca.dtos.LoginDTO;
import com.biblioteca.dtos.RegisterDTO;
import com.biblioteca.dtos.ResponseDTO;
import com.biblioteca.models.Utente;
import com.biblioteca.security.JwtUtil;
import com.biblioteca.repositories.UtenteRepository;

@Service
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UtenteRepository utenteRepository;
    private final JwtUtil jwtUtil;

    public AuthService(UtenteRepository utenteRepository, JwtUtil jwtUtil) {
        this.utenteRepository = utenteRepository;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public ResponseDTO register(RegisterDTO registerDTO) {
        if (utenteRepository.existsByEmail(registerDTO.getEmail())) {
            logger.warn("Email già esistente: {}", registerDTO.getEmail());
            return new ResponseDTO(false, "Email già esistente!");
        }

        try {
            Utente utente = registerDTO.toEntity();
            utenteRepository.save(utente);
            logger.info("Registrazione avvenuta con successo per l'utente: {}", utente.getNome());
            return new ResponseDTO(true, "Registrazione avvenuta con successo!");
        } catch (Exception e) {
            logger.error("Errore durante la registrazione dell'utente: {}", registerDTO.getNome(), e);
            return new ResponseDTO(false, "Errore durante la registrazione!");
        }

    }

    @Transactional(readOnly = true)
    public ResponseDTO login(LoginDTO loginDTO) {
        try {
            Utente utente = this.utenteRepository.findByEmail(loginDTO.getEmail())
                    .orElse(null);

            if (utente == null) {
                logger.warn("Email non esiste: {}", loginDTO.getEmail());
                return new ResponseDTO(false, "Credenziali errate!");
            }

            if (!utente.comparePassword(loginDTO.getPassword())) {
                logger.warn("Password errata per l'utente: {}", loginDTO.getEmail());
                return new ResponseDTO(false, "Credenziali errate!");
            }

            String token = jwtUtil.generateToken(utente);
            logger.info("Login avvenuto con successo per: {}", loginDTO.getEmail());
            return new ResponseDTO(true, "Login avvenuto con successo!", token);
        } catch (Exception e) {
            logger.error("Errore durante il login per: {}", loginDTO.getEmail(), e);
            return new ResponseDTO(false, "Errore durante il login!");
        }
    }

}
