package com.biblioteca.dtos;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.biblioteca.models.Utente;
import com.biblioteca.models.enums.Ruoli;

public class RegisterDTO {

    @NotBlank(message = "Il nome è obbligatorio")
    private String nome;

    @NotBlank(message = "L'email è obbligatoria")
    @Email(message = "Formato email non valido")
    private String email;

    @NotBlank(message = "La password è obbligatoria")
    @Size(min = 8, message = "La password deve contenere almeno 8 caratteri")
    private String password;

    private String ruolo = Ruoli.ROLE_USER.toString();

    public RegisterDTO() {
    }

    public RegisterDTO(String nome, String email, String password, String ruolo) {
        this.nome = nome;
        this.email = email;
        this.password = password;
        this.ruolo = ruolo != null ? ruolo : Ruoli.ROLE_USER.toString();
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

    public Utente toEntity() {
        Utente utente = new Utente();
        utente.setNome(this.nome);
        utente.setEmail(this.email);
        utente.setPassword(this.password);
        utente.setRuolo(Ruoli.valueOf(this.ruolo));
        return utente;
    }
}