
package com.biblioteca.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.biblioteca.models.Prestito;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrestitoRepository extends JpaRepository<Prestito, Long> {
    List<Prestito> findByUtenteId(Long utenteId);

    Optional<Prestito> findByUtenteIdAndLibroIdAndRestituitoFalse(Long utenteId, Long libroId);

    boolean existsByLibroIdAndRestituitoFalse(Long libroId);
}