package com.biblioteca.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.biblioteca.models.Utente;
import com.biblioteca.models.enums.Ruoli;

@Repository
public interface UtenteRepository extends JpaRepository<Utente, Long> {
    Optional<Utente> findByEmail(String email);

    List<Utente> findByRuolo(Ruoli ruolo);

    boolean existsByEmail(String email);

    List<Utente> findByNomeContainingIgnoreCase(String nome);
}