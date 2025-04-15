package com.biblioteca.utenti.providers;

import com.biblioteca.libri.entities.Libro;
import com.biblioteca.libri.repositories.LibroRepository;
import com.biblioteca.prestiti.entities.Prestito;
import com.biblioteca.prestiti.repositories.PrestitoRepository;
import com.biblioteca.prestiti.dtos.PrestitoDTO;
import com.biblioteca.utenti.dtos.ResponseDTO;
import com.biblioteca.libri.dtos.LibroStatisticaDTO;

import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private LibroRepository libroRepository;

    @Autowired
    private PrestitoRepository prestitoRepository;

    @Transactional
    public ResponseDTO aggiungiLibro(Libro libro) {
        if (libro.getTitolo() == null || libro.getAutore() == null || libro.getGenere() == null
                || libro.getAnnoDiPubblicazione() == null || libro.getCopieDisponibili() <= 0) {
            return new ResponseDTO(false, "Dati libro non validi");
        }
        if (libroRepository.existsByTitoloAndAutore(libro.getTitolo(), libro.getAutore()))
            return new ResponseDTO(false, "Libro già esistente");
        try {
            libroRepository.save(libro);
            return new ResponseDTO(true, "Libro aggiunto con successo");
        } catch (Exception e) {
            return new ResponseDTO(false, "Errore durante l'aggiunta del libro: " + e.getMessage());
        }
    }

    @Transactional
    public ResponseDTO modificaLibro(Long id, Libro libroModificato) {
        try {
            Optional<Libro> libroOpt = libroRepository.findById(id);
            if (libroOpt.isEmpty()) {
                return new ResponseDTO(false, "Libro non trovato");
            }

            Libro libro = libroOpt.get();
            libro.setTitolo(libroModificato.getTitolo());
            libro.setAutore(libroModificato.getAutore());
            libro.setGenere(libroModificato.getGenere());

            libroRepository.save(libro);
            return new ResponseDTO(true, "Libro modificato con successo");
        } catch (Exception e) {
            return new ResponseDTO(false, "Errore durante la modifica del libro: " + e.getMessage());
        }
    }

    @Transactional
    public ResponseDTO rimuoviLibro(Long id) {
        if (id == null)
            return new ResponseDTO(false, "ID libro non valido");
        try {
            Optional<Libro> libroOpt = libroRepository.findById(id);
            if (libroOpt.isEmpty())
                return new ResponseDTO(false, "Libro non trovato");
            boolean isLoaned = prestitoRepository.existsByLibroIdAndRestituitoFalse(id);
            if (isLoaned)
                return new ResponseDTO(false, "Impossibile rimuovere un libro attualmente in prestito");

            libroRepository.deleteById(id);
            return new ResponseDTO(true, "Libro rimosso con successo");
        } catch (Exception e) {
            return new ResponseDTO(false, "Errore durante la rimozione del libro: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public List<PrestitoDTO> getTuttiPrestiti() {
        List<Prestito> prestiti = prestitoRepository.findAll();
        return prestiti.stream().map(prestito -> {
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

            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LibroStatisticaDTO> getLibriPiuLetti() {
        List<Prestito> tuttiPrestiti = prestitoRepository.findAll();

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
            LibroStatisticaDTO dto = new LibroStatisticaDTO();
            dto.setIdLibro(idLibro);
            dto.setTitolo(titoliLibri.get(idLibro));
            dto.setAutore(autoriLibri.get(idLibro));
            dto.setNumeroPrestiti(entry.getValue());
            risultato.add(dto);
        }

        return risultato.stream()
                .sorted((a, b) -> b.getNumeroPrestiti().compareTo(a.getNumeroPrestiti()))
                .collect(Collectors.toList());
    }
}