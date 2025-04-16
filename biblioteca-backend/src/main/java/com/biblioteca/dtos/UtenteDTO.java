package com.biblioteca.dtos;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

import com.biblioteca.models.Utente;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Data Transfer Object for User information
 */
public class UtenteDTO {

    private Long id;

    @NotBlank(message = "Il nome è obbligatorio")
    private String nome;

    @NotBlank(message = "L'email è obbligatoria")
    @Email(message = "Formato email non valido")
    private String email;

    @JsonIgnore
    private String password;

    private String ruolo;

    public UtenteDTO() {
    }

    public UtenteDTO(Long id, String nome, String email, String ruolo) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.ruolo = ruolo;
    }

    public static UtenteDTO fromEntity(Utente utente) {
        if (utente == null) {
            return null;
        }

        UtenteDTO dto = new UtenteDTO();
        dto.setId(utente.getId());
        dto.setNome(utente.getNome());
        dto.setEmail(utente.getEmail());
        dto.setRuolo(utente.getRuolo() != null ? utente.getRuolo().toString() : null);
        return dto;
    }

    public Utente toEntity() {
        Utente utente = new Utente();
        utente.setId(this.id);
        utente.setNome(this.nome);
        utente.setEmail(this.email);
        if (this.password != null) {
            utente.setPassword(this.password);
        }
        return utente;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRuolo() {
        return ruolo;
    }

    public void setRuolo(String ruolo) {
        this.ruolo = ruolo;
    }
}