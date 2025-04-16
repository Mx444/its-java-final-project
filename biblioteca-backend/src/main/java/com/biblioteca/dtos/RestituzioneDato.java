package com.biblioteca.dtos;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

public class RestituzioneDato {

    @NotNull(message = "L'ID del prestito è obbligatorio")
    @Positive(message = "L'ID del prestito deve essere un numero positivo")
    private Long idPrestito;

    public RestituzioneDato() {
    }

    public RestituzioneDato(Long idPrestito) {
        this.idPrestito = idPrestito;
    }

    public Long getIdPrestito() {
        return idPrestito;
    }

    public void setIdPrestito(Long idPrestito) {
        this.idPrestito = idPrestito;
    }
}