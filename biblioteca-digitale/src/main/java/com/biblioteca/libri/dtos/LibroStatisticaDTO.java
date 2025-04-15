package com.biblioteca.libri.dtos;

public class LibroStatisticaDTO {
    private Long idLibro;
    private String titolo;
    private String autore;
    private Integer numeroPrestiti;

    public Long getIdLibro() {
        return idLibro;
    }

    public void setIdLibro(Long idLibro) {
        this.idLibro = idLibro;
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

    public Integer getNumeroPrestiti() {
        return numeroPrestiti;
    }

    public void setNumeroPrestiti(Integer numeroPrestiti) {
        this.numeroPrestiti = numeroPrestiti;
    }
}