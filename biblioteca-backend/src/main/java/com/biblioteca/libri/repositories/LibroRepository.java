package com.biblioteca.libri.repositories;

import com.biblioteca.libri.entities.Libro;
import com.biblioteca.prestiti.entities.Prestito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LibroRepository extends JpaRepository<Libro, Long> {
    Optional<Libro> findById(Long id);

    List<Libro> findByTitoloContainingIgnoreCase(String titolo);

    List<Libro> findByAutoreContainingIgnoreCase(String autore);

    List<Libro> findByPrestiti(Prestito prestito);

    boolean existsByTitoloAndAutore(String titolo, String autore);
}
