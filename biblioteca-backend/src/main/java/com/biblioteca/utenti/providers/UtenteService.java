package com.biblioteca.utenti.providers;

import com.biblioteca.libri.entities.Libro;
import com.biblioteca.libri.repositories.LibroRepository;
import com.biblioteca.prestiti.dtos.PrestitoDTO;
import com.biblioteca.prestiti.entities.Prestito;
import com.biblioteca.prestiti.repositories.PrestitoRepository;
import com.biblioteca.utenti.dtos.ResponseDTO;
import com.biblioteca.utenti.entities.Utente;
import com.biblioteca.utenti.repositories.UtenteRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private LibroRepository libroRepository;

    @Autowired
    private PrestitoRepository prestitoRepository;

    @Autowired
    private UtenteRepository utenteRepository;

    @Transactional(readOnly = true)
    public List<Libro> getAllLibri() {
        return libroRepository.findAll();
    }

    @Transactional
    public ResponseDTO creaPrestito(Long idLibro) {
        if (idLibro == null)
            return new ResponseDTO(false, "ID libro non valido");
        Utente utenteCorrente = getUtenteCorrente();
        if (utenteCorrente == null)
            return new ResponseDTO(false, "Utente non autenticato");
        Optional<Libro> libroOpt = libroRepository.findById(idLibro);
        if (libroOpt.isEmpty())
            return new ResponseDTO(false, "Libro non trovato");
        Libro libro = libroOpt.get();
        if (libro.getCopieDisponibili() <= 0)
            return new ResponseDTO(false, "Nessuna copia disponibile");
        boolean haGiaInPrestito = prestitoRepository.findByUtenteIdAndLibroIdAndRestituitoFalse(
                utenteCorrente.getId(), libro.getId()).isPresent();
        if (haGiaInPrestito)
            return new ResponseDTO(false, "Hai già questo libro in prestito");
        LocalDate oggi = LocalDate.now();
        LocalDate scadenza = oggi.plusDays(30);
        Prestito prestito = new Prestito();
        prestito.setIdUtente(utenteCorrente);
        prestito.setIdLibro(libro);
        prestito.setDataInizio(Date.valueOf(oggi));
        prestito.setDataFine(Date.valueOf(scadenza));
        prestito.setRestituito(false);
        libro.addPrestito(prestito);
        libro.setCopieDisponibili(libro.getCopieDisponibili() - 1);
        try {
            prestitoRepository.save(prestito);
            logger.info("Creato prestito del libro '{}' per l'utente '{}'", libro.getTitolo(),
                    utenteCorrente.getEmail());
            return new ResponseDTO(true, "Prestito creato con successo");
        } catch (Exception e) {
            logger.error("Errore durante la creazione del prestito: {}", e.getMessage(), e);
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return new ResponseDTO(false, "Errore durante la creazione del prestito: " + e.getMessage());
        }
    }

    @Transactional
    public ResponseDTO restituisciLibro(Long idPrestito) {
        if (idPrestito == null)
            return new ResponseDTO(false, "ID prestito non valido");
        Utente utenteCorrente = getUtenteCorrente();
        if (utenteCorrente == null)
            return new ResponseDTO(false, "Utente non autenticato");
        Optional<Prestito> prestitoOpt = prestitoRepository.findById(idPrestito);
        if (prestitoOpt.isEmpty())
            return new ResponseDTO(false, "Prestito non trovato");
        Prestito prestito = prestitoOpt.get();
        if (!prestito.getUtente().getId().equals(utenteCorrente.getId())) {
            logger.warn("Tentativo di restituire prestito non appartenente all'utente: {}", utenteCorrente.getEmail());
            return new ResponseDTO(false, "Non autorizzato a restituire questo prestito");
        }
        if (prestito.getRestituito())
            return new ResponseDTO(false, "Libro già restituito");
        prestito.setRestituito(true);
        prestito.setDataRestituzione(Date.valueOf(LocalDate.now()));
        Libro libro = prestito.getLibro();
        libro.setCopieDisponibili(libro.getCopieDisponibili() + 1);
        try {
            prestitoRepository.save(prestito);
            logger.info("Restituito libro '{}' dall'utente '{}'",
                    libro.getTitolo(), utenteCorrente.getEmail());
            return new ResponseDTO(true, "Libro restituito con successo");
        } catch (Exception e) {
            logger.error("Errore durante la restituzione del libro: {}", e.getMessage());
            return new ResponseDTO(false, "Errore durante la restituzione del libro");
        }
    }

    @Transactional(readOnly = true)
    public List<PrestitoDTO> getMieiPrestiti() {
        Utente utenteCorrente = getUtenteCorrente();
        if (utenteCorrente == null)
            return List.of();

        List<Prestito> prestiti = prestitoRepository.findByUtenteId(utenteCorrente.getId());
        return prestiti.stream().map(prestito -> {
            PrestitoDTO dto = new PrestitoDTO();
            dto.setId(prestito.getId());
            dto.setDataInizio(prestito.getDataInizio());
            dto.setDataRestituzione(prestito.getDataRestituzione());
            dto.setDataFine(prestito.getDataFine());
            dto.setRestituito(prestito.getRestituito());

            Libro libro = prestito.getLibro();
            PrestitoDTO.LibroDTO libroDTO = new PrestitoDTO.LibroDTO();
            libroDTO.setId(libro.getId());
            libroDTO.setTitolo(libro.getTitolo());
            libroDTO.setAutore(libro.getAutore());
            libroDTO.setGenere(libro.getGenere());
            dto.setLibro(libroDTO);

            return dto;
        }).collect(Collectors.toList());
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