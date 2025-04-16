package com.biblioteca.models;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "loans")
public class Prestito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "loan_id", updatable = false, nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties("prestiti")
    private Utente utente;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Libro libro;

    @Column(nullable = false)
    private Date dataInizio;

    @Column(nullable = true)
    private Date dataRestituzione = null;

    @Column(nullable = false)
    private Date dataFine;

    @Column(nullable = false)
    private boolean restituito;

    public Prestito() {
    }

    public Prestito(Utente utente, Libro libro, Date dataInizio, Date dataFine,
            boolean restituito) {
        this.utente = utente;
        this.libro = libro;
        this.dataInizio = dataInizio;
        this.dataFine = dataFine;
        this.restituito = restituito;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Utente getUtente() {
        return utente;
    }

    public void setIdUtente(Utente utente) {
        this.utente = utente;
    }

    public Libro getLibro() {
        return libro;
    }

    public void setIdLibro(Libro libro) {
        this.libro = libro;
    }

    public Date getDataInizio() {
        return dataInizio;
    }

    public Date getDataRestituzione() {
        return dataRestituzione;
    }

    public void setDataRestituzione(Date dataRestituzione) {
        this.dataRestituzione = dataRestituzione;
    }

    public void setDataInizio(Date dataInizio) {
        this.dataInizio = dataInizio;
    }

    public Date getDataFine() {
        return dataFine;
    }

    public void setDataFine(Date dataFine) {
        this.dataFine = dataFine;
    }

    public boolean getRestituito() {
        return restituito;
    }

    public void setRestituito(boolean restituito) {
        this.restituito = restituito;
    }

    @Override
    public String toString() {
        return "Prestito{" +
                "id=" + id +
                ", utente=" + utente +
                ", libro=" + libro +
                ", dataInizio=" + dataInizio +
                ", dataFine=" + dataFine +
                ", restituito=" + restituito +
                '}';
    }
}
