package com.biblioteca.prestiti.dtos;

import java.sql.Date;

public class PrestitoDTO {
    private Long id;
    private Date dataInizio;
    private Date dataFine;
    private Boolean restituito;
    private LibroDTO libro;

    public static class LibroDTO {
        private Long id;
        private String titolo;
        private String autore;
        private String genere;

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
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getDataInizio() {
        return dataInizio;
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

    public Boolean getRestituito() {
        return restituito;
    }

    public void setRestituito(Boolean restituito) {
        this.restituito = restituito;
    }

    public LibroDTO getLibro() {
        return libro;
    }

    public void setLibro(LibroDTO libro) {
        this.libro = libro;
    }
}