package com.biblioteca.providers;

import com.biblioteca.dtos.LibroDTO;
import com.biblioteca.dtos.LibroStatisticaDTO;
import com.biblioteca.dtos.PrestitoDTO;
import com.biblioteca.dtos.ResponseDTO;
import com.biblioteca.models.Libro;
import com.biblioteca.models.Prestito;
import com.biblioteca.repositories.LibroRepository;
import com.biblioteca.repositories.PrestitoRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.HashMap;

@Service
public class AdminService {
    private static final Logger logger = LoggerFactory.getLogger(AdminService.class);

    private final LibroRepository libroRepository;
    private final PrestitoRepository prestitoRepository;

    public AdminService(LibroRepository libroRepository, PrestitoRepository prestitoRepository) {
        this.libroRepository = libroRepository;
        this.prestitoRepository = prestitoRepository;
    }

    @Transactional
    public ResponseDTO aggiungiLibro(LibroDTO libroDTO) {

        if (libroRepository.existsByTitoloAndAutore(libroDTO.getTitolo(), libroDTO.getAutore())) {
            logger.warn("Tentativo di aggiungere un libro già esistente: '{}' di {}",
                    libroDTO.getTitolo(), libroDTO.getAutore());
            return new ResponseDTO(false, "Libro già esistente");
        }

        try {
            Libro libro = libroDTO.toEntity();
            libroRepository.save(libro);
            logger.info("Aggiunto nuovo libro: '{}' di {}", libro.getTitolo(), libro.getAutore());
            return new ResponseDTO(true, "Libro aggiunto con successo");
        } catch (Exception e) {
            logger.error("Errore durante l'aggiunta del libro: {}", e.getMessage(), e);
            return new ResponseDTO(false, "Errore durante l'aggiunta del libro: " + e.getMessage());
        }
    }

    @Transactional
    public ResponseDTO modificaLibro(Long id, LibroDTO libroDTO) {
        if (id == null) {
            logger.warn("Tentativo di modificare un libro con ID nullo");
            return new ResponseDTO(false, "ID libro non valido");
        }

        try {
            Optional<Libro> libroOpt = libroRepository.findById(id);
            if (libroOpt.isEmpty()) {
                logger.warn("Tentativo di modificare un libro non esistente: ID {}", id);
                return new ResponseDTO(false, "Libro non trovato");
            }

            Libro libro = libroOpt.get();
            updateLibroFromDTO(libro, libroDTO);

            libroRepository.save(libro);
            logger.info("Libro modificato con successo: ID {}, Titolo: '{}'", id, libro.getTitolo());
            return new ResponseDTO(true, "Libro modificato con successo");
        } catch (Exception e) {
            logger.error("Errore durante la modifica del libro ID {}: {}", id, e.getMessage(), e);
            return new ResponseDTO(false, "Errore durante la modifica del libro: " + e.getMessage());
        }
    }

    @Transactional
    public ResponseDTO rimuoviLibro(Long id) {
        if (id == null) {
            logger.warn("Tentativo di rimuovere un libro con ID nullo");
            return new ResponseDTO(false, "ID libro non valido");
        }

        try {
            Optional<Libro> libroOpt = libroRepository.findById(id);
            if (libroOpt.isEmpty()) {
                logger.warn("Tentativo di rimuovere un libro non esistente: ID {}", id);
                return new ResponseDTO(false, "Libro non trovato");
            }

            boolean isLoaned = prestitoRepository.existsByLibroIdAndRestituitoFalse(id);
            if (isLoaned) {
                logger.warn("Tentativo di rimuovere un libro attualmente in prestito: ID {}", id);
                return new ResponseDTO(false, "Impossibile rimuovere un libro attualmente in prestito");
            }

            libroRepository.deleteById(id);
            logger.info("Libro rimosso con successo: ID {}", id);
            return new ResponseDTO(true, "Libro rimosso con successo");
        } catch (Exception e) {
            logger.error("Errore durante la rimozione del libro ID {}: {}", id, e.getMessage(), e);
            return new ResponseDTO(false, "Errore durante la rimozione del libro: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public List<PrestitoDTO> getTuttiPrestiti() {
        List<Prestito> prestiti = prestitoRepository.findAll();
        logger.info("Recuperati {} prestiti", prestiti.size());
        return prestiti.stream()
                .map(this::convertPrestitoToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LibroStatisticaDTO> getLibriPiuLetti() {
        List<Prestito> tuttiPrestiti = prestitoRepository.findAll();
        logger.info("Generando statistiche dai {} prestiti recuperati", tuttiPrestiti.size());

        Map<Long, Integer> conteggioLibri = new HashMap<>();
        Map<Long, String> titoliLibri = new HashMap<>();
        Map<Long, String> autoriLibri = new HashMap<>();

        for (Prestito prestito : tuttiPrestiti) {
            Long idLibro = prestito.getLibro().getId();
            String titoloLibro = prestito.getLibro().getTitolo();
            String autoreLibro = prestito.getLibro().getAutore();

            conteggioLibri.put(idLibro, conteggioLibri.getOrDefault(idLibro, 0) + 1);
            titoliLibri.put(idLibro, titoloLibro);
            autoriLibri.put(idLibro, autoreLibro);
        }

        List<LibroStatisticaDTO> risultato = new ArrayList<>();
        for (Map.Entry<Long, Integer> entry : conteggioLibri.entrySet()) {
            Long idLibro = entry.getKey();
            LibroStatisticaDTO dto = new LibroStatisticaDTO(
                    idLibro,
                    titoliLibri.get(idLibro),
                    autoriLibri.get(idLibro),
                    entry.getValue());
            risultato.add(dto);
        }

        return risultato.stream()
                .sorted((a, b) -> b.getNumeroPrestiti().compareTo(a.getNumeroPrestiti()))
                .collect(Collectors.toList());
    }

    private void updateLibroFromDTO(Libro libro, LibroDTO libroDTO) {
        libro.setTitolo(libroDTO.getTitolo());
        libro.setAutore(libroDTO.getAutore());
        libro.setGenere(libroDTO.getGenere());
        libro.setAnnoDiPubblicazione(libroDTO.getAnnoDiPubblicazione());
        libro.setCopieDisponibili(libroDTO.getCopieDisponibili());
    }

    private PrestitoDTO convertPrestitoToDTO(Prestito prestito) {
        PrestitoDTO dto = new PrestitoDTO();
        dto.setId(prestito.getId());
        dto.setDataInizio(prestito.getDataInizio());
        dto.setDataFine(prestito.getDataFine());
        dto.setRestituito(prestito.getRestituito());

        Libro libro = prestito.getLibro();
        PrestitoDTO.LibroDTO libroDTO = new PrestitoDTO.LibroDTO();
        libroDTO.setId(libro.getId());
        libroDTO.setTitolo(libro.getTitolo());
        libroDTO.setAutore(libro.getAutore());
        libroDTO.setGenere(libro.getGenere());
        dto.setLibro(libroDTO);

        PrestitoDTO.UtenteDTO utenteDTO = new PrestitoDTO.UtenteDTO();
        utenteDTO.setId(prestito.getUtente().getId());
        utenteDTO.setNome(prestito.getUtente().getNome());
        utenteDTO.setEmail(prestito.getUtente().getEmail());
        dto.setUtente(utenteDTO);

        return dto;
    }
}