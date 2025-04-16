package com.biblioteca.dtos;

import java.sql.Date;

import com.biblioteca.models.Libro;
import com.biblioteca.models.Prestito;

public class PrestitoDTO {
    private Long id;
    private Date dataInizio;
    private Date dataFine;
    private Date dataRestituzione;
    private Boolean restituito;
    private LibroDTO libro;
    private UtenteDTO utente;

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

    public static class UtenteDTO {
        private Long id;
        private String nome;
        private String email;

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
    }

    public static PrestitoDTO fromEntity(Prestito prestito) {
        PrestitoDTO dto = new PrestitoDTO();
        dto.setId(prestito.getId());
        dto.setDataInizio(prestito.getDataInizio());
        dto.setDataFine(prestito.getDataFine());
        dto.setDataRestituzione(prestito.getDataRestituzione());
        dto.setRestituito(prestito.getRestituito());

        Libro libro = prestito.getLibro();
        if (libro != null) {
            LibroDTO libroDTO = new LibroDTO();
            libroDTO.setId(libro.getId());
            libroDTO.setTitolo(libro.getTitolo());
            libroDTO.setAutore(libro.getAutore());
            libroDTO.setGenere(libro.getGenere());
            dto.setLibro(libroDTO);
        }

        if (prestito.getUtente() != null) {
            UtenteDTO utenteDTO = new UtenteDTO();
            utenteDTO.setId(prestito.getUtente().getId());
            utenteDTO.setNome(prestito.getUtente().getNome());
            utenteDTO.setEmail(prestito.getUtente().getEmail());
            dto.setUtente(utenteDTO);
        }

        return dto;
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

    public Date getDataRestituzione() {
        return dataRestituzione;
    }

    public void setDataRestituzione(Date dataRestituzione) {
        this.dataRestituzione = dataRestituzione;
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

    public UtenteDTO getUtente() {
        return utente;
    }

    public void setUtente(UtenteDTO utente) {
        this.utente = utente;
    }
}