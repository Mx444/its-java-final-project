package com.biblioteca.providers;

import com.biblioteca.dtos.PrestitoDTO;
import com.biblioteca.dtos.PrestitoRequestDTO;
import com.biblioteca.dtos.ResponseDTO;
import com.biblioteca.dtos.RestituzioneDato;
import com.biblioteca.models.Libro;
import com.biblioteca.models.Prestito;
import com.biblioteca.models.Utente;
import com.biblioteca.repositories.LibroRepository;
import com.biblioteca.repositories.PrestitoRepository;
import com.biblioteca.repositories.UtenteRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UtenteService {
    private static final Logger logger = LoggerFactory.getLogger(UtenteService.class);

    private final LibroRepository libroRepository;
    private final PrestitoRepository prestitoRepository;
    private final UtenteRepository utenteRepository;

    public UtenteService(
            LibroRepository libroRepository,
            PrestitoRepository prestitoRepository,
            UtenteRepository utenteRepository) {
        this.libroRepository = libroRepository;
        this.prestitoRepository = prestitoRepository;
        this.utenteRepository = utenteRepository;
    }

    @Transactional(readOnly = true)
    public List<Libro> getAllLibri() {
        return libroRepository.findAll();
    }

    @Transactional
    public ResponseDTO creaPrestito(PrestitoRequestDTO prestitoRequest) {
        if (prestitoRequest == null || prestitoRequest.getIdLibro() == null) {
            return new ResponseDTO(false, "Dati del prestito non validi");
        }

        Utente utenteCorrente = getUtenteCorrente();
        if (utenteCorrente == null) {
            return new ResponseDTO(false, "Utente non autenticato");
        }

        Long idLibro = prestitoRequest.getIdLibro();
        Optional<Libro> libroOpt = libroRepository.findById(idLibro);
        if (libroOpt.isEmpty()) {
            logger.warn("Tentativo di prestito di un libro non esistente: ID {}", idLibro);
            return new ResponseDTO(false, "Libro non trovato");
        }

        Libro libro = libroOpt.get();

        if (libro.getCopieDisponibili() <= 0) {
            logger.info("Tentativo di prestito di un libro non disponibile: '{}'", libro.getTitolo());
            return new ResponseDTO(false, "Nessuna copia disponibile");
        }

        boolean haGiaInPrestito = prestitoRepository.findByUtenteIdAndLibroIdAndRestituitoFalse(
                utenteCorrente.getId(), libro.getId()).isPresent();
        if (haGiaInPrestito) {
            logger.info("Utente '{}' ha già in prestito il libro '{}'",
                    utenteCorrente.getEmail(), libro.getTitolo());
            return new ResponseDTO(false, "Hai già questo libro in prestito");
        }

        try {
            Prestito prestito = createNewPrestito(utenteCorrente, libro);
            prestitoRepository.save(prestito);

            libro.setCopieDisponibili(libro.getCopieDisponibili() - 1);

            logger.info("Creato prestito del libro '{}' per l'utente '{}'",
                    libro.getTitolo(), utenteCorrente.getEmail());
            return new ResponseDTO(true, "Prestito creato con successo");
        } catch (Exception e) {
            logger.error("Errore durante la creazione del prestito: {}", e.getMessage(), e);
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return new ResponseDTO(false, "Errore durante la creazione del prestito: " + e.getMessage());
        }
    }

    @Transactional
    public ResponseDTO restituisciLibro(RestituzioneDato restituzioneDato) {
        if (restituzioneDato == null || restituzioneDato.getIdPrestito() == null) {
            return new ResponseDTO(false, "ID prestito non valido");
        }

        Utente utenteCorrente = getUtenteCorrente();
        if (utenteCorrente == null) {
            return new ResponseDTO(false, "Utente non autenticato");
        }

        Long idPrestito = restituzioneDato.getIdPrestito();
        Optional<Prestito> prestitoOpt = prestitoRepository.findById(idPrestito);
        if (prestitoOpt.isEmpty()) {
            logger.warn("Tentativo di restituzione di un prestito non esistente: ID {}", idPrestito);
            return new ResponseDTO(false, "Prestito non trovato");
        }

        Prestito prestito = prestitoOpt.get();

        if (!prestito.getUtente().getId().equals(utenteCorrente.getId())) {
            logger.warn("Tentativo di restituire prestito non appartenente all'utente: {}",
                    utenteCorrente.getEmail());
            return new ResponseDTO(false, "Non autorizzato a restituire questo prestito");
        }

        if (prestito.getRestituito()) {
            return new ResponseDTO(false, "Libro già restituito");
        }

        try {
            processBookReturn(prestito);
            logger.info("Restituito libro '{}' dall'utente '{}'",
                    prestito.getLibro().getTitolo(), utenteCorrente.getEmail());
            return new ResponseDTO(true, "Libro restituito con successo");
        } catch (Exception e) {
            logger.error("Errore durante la restituzione del libro: {}", e.getMessage(), e);
            return new ResponseDTO(false, "Errore durante la restituzione del libro");
        }
    }

    @Transactional
    public ResponseDTO restituisciLibro(Long idPrestito) {
        if (idPrestito == null) {
            return new ResponseDTO(false, "ID prestito non valido");
        }

        Utente utenteCorrente = getUtenteCorrente();
        if (utenteCorrente == null) {
            return new ResponseDTO(false, "Utente non autenticato");
        }

        Optional<Prestito> prestitoOpt = prestitoRepository.findById(idPrestito);
        if (prestitoOpt.isEmpty()) {
            logger.warn("Tentativo di restituzione di un prestito non esistente: ID {}", idPrestito);
            return new ResponseDTO(false, "Prestito non trovato");
        }

        Prestito prestito = prestitoOpt.get();

        if (!prestito.getUtente().getId().equals(utenteCorrente.getId())) {
            logger.warn("Tentativo di restituire prestito non appartenente all'utente: {}",
                    utenteCorrente.getEmail());
            return new ResponseDTO(false, "Non autorizzato a restituire questo prestito");
        }

        if (prestito.getRestituito()) {
            return new ResponseDTO(false, "Libro già restituito");
        }

        try {
            processBookReturn(prestito);
            logger.info("Restituito libro '{}' dall'utente '{}'",
                    prestito.getLibro().getTitolo(), utenteCorrente.getEmail());
            return new ResponseDTO(true, "Libro restituito con successo");
        } catch (Exception e) {
            logger.error("Errore durante la restituzione del libro: {}", e.getMessage(), e);
            return new ResponseDTO(false, "Errore durante la restituzione del libro");
        }
    }

    @Transactional(readOnly = true)
    public List<PrestitoDTO> getMieiPrestiti() {
        Utente utenteCorrente = getUtenteCorrente();
        if (utenteCorrente == null) {
            logger.warn("Tentativo di accesso ai prestiti senza autenticazione");
            return List.of();
        }

        List<Prestito> prestiti = prestitoRepository.findByUtenteId(utenteCorrente.getId());
        return prestiti.stream()
                .map(PrestitoDTO::fromEntity)
                .collect(Collectors.toList());
    }

    private Prestito createNewPrestito(Utente utente, Libro libro) {
        LocalDate oggi = LocalDate.now();
        LocalDate scadenza = oggi.plusDays(30);

        Prestito prestito = new Prestito();
        prestito.setIdUtente(utente);
        prestito.setIdLibro(libro);
        prestito.setDataInizio(Date.valueOf(oggi));
        prestito.setDataFine(Date.valueOf(scadenza));
        prestito.setRestituito(false);

        libro.addPrestito(prestito);
        return prestito;
    }

    private void processBookReturn(Prestito prestito) {
        prestito.setRestituito(true);
        prestito.setDataRestituzione(Date.valueOf(LocalDate.now()));

        Libro libro = prestito.getLibro();
        libro.setCopieDisponibili(libro.getCopieDisponibili() + 1);

        prestitoRepository.save(prestito);
    }

    private Utente getUtenteCorrente() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }

        String email = auth.getName();
        return utenteRepository.findByEmail(email).orElse(null);
    }
}