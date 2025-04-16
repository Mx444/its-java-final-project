package com.biblioteca.dtos;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.biblioteca.models.Libro;

public class LibroDTO {

    private Long id;

    @NotBlank(message = "Il titolo è obbligatorio")
    private String titolo;

    @NotBlank(message = "L'autore è obbligatorio")
    private String autore;

    @NotBlank(message = "Il genere è obbligatorio")
    private String genere;

    @NotNull(message = "L'anno di pubblicazione è obbligatorio")
    private Integer annoDiPubblicazione;

    @NotNull(message = "Il numero di copie è obbligatorio")
    @Min(value = 1, message = "Il numero di copie deve essere almeno 1")
    private Integer copieDisponibili;

    public LibroDTO() {
    }

    public static LibroDTO fromEntity(Libro libro) {
        LibroDTO dto = new LibroDTO();
        dto.setId(libro.getId());
        dto.setTitolo(libro.getTitolo());
        dto.setAutore(libro.getAutore());
        dto.setGenere(libro.getGenere());
        dto.setAnnoDiPubblicazione(libro.getAnnoDiPubblicazione());
        dto.setCopieDisponibili(libro.getCopieDisponibili());
        return dto;
    }

    public Libro toEntity() {
        Libro libro = new Libro();
        libro.setId(this.id);
        libro.setTitolo(this.titolo);
        libro.setAutore(this.autore);
        libro.setGenere(this.genere);
        libro.setAnnoDiPubblicazione(this.annoDiPubblicazione);
        libro.setCopieDisponibili(this.copieDisponibili);
        return libro;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitolo() {
        return titolo;
    }

    public void setTitolo(String titolo) {
        this.titolo = titolo;
    }

    public String getAutore() {
        return autore;
    }

    public void setAutore(String autore) {
        this.autore = autore;
    }

    public String getGenere() {
        return genere;
    }

    public void setGenere(String genere) {
        this.genere = genere;
    }

    public Integer getAnnoDiPubblicazione() {
        return annoDiPubblicazione;
    }

    public void setAnnoDiPubblicazione(Integer annoDiPubblicazione) {
        this.annoDiPubblicazione = annoDiPubblicazione;
    }

    public Integer getCopieDisponibili() {
        return copieDisponibili;
    }

    public void setCopieDisponibili(Integer copieDisponibili) {
        this.copieDisponibili = copieDisponibili;
    }
}