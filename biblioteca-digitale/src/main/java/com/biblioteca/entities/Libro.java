package com.biblioteca.entities;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "books")
public class Libro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_id", updatable = false, nullable = false)
    private Long id;

    @Column(name = "title", nullable = false, unique = true)
    private String titolo;

    @Column(name = "author", nullable = false)
    private String autore;

    @Column(name = "genre", nullable = false)
    private String genere;

    @Column(name = "publication_year", nullable = false)
    private Date annoDiPubblicazione;

    @Column(name = "available_copies", nullable = false)
    private int copieDisponibili;

    @OneToMany(mappedBy = "libro", cascade = CascadeType.ALL)
    private List<Prestito> prestiti = new ArrayList<>();

    public Libro() {
    }

    public Libro(String titolo, String autore, String genere, Date annoDiPubblicazione, int copieDisponibili) {
        this.titolo = titolo;
        this.autore = autore;
        this.genere = genere;
        this.annoDiPubblicazione = annoDiPubblicazione;
        this.copieDisponibili = copieDisponibili;
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

    public Date getAnnoDiPubblicazione() {
        return annoDiPubblicazione;
    }

    public void setAnnoDiPubblicazione(Date annoDiPubblicazione) {
        this.annoDiPubblicazione = annoDiPubblicazione;
    }

    public int getCopieDisponibili() {
        return copieDisponibili;
    }

    public void setCopieDisponibili(int copieDisponibili) {
        this.copieDisponibili = copieDisponibili;
    }

    @Override
    public String toString() {
        return "Libro{" +
                "id=" + id +
                ", titolo='" + titolo + '\'' +
                ", autore='" + autore + '\'' +
                ", genere='" + genere + '\'' +
                ", annoDiPubblicazione=" + annoDiPubblicazione +
                ", copieDisponibili=" + copieDisponibili +
                '}';
    }
}
