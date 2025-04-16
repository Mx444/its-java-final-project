package com.biblioteca.dtos;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

public class PrestitoRequestDTO {

    @NotNull(message = "L'ID del libro è obbligatorio")
    @Positive(message = "L'ID del libro deve essere un numero positivo")
    private Long idLibro;

    public PrestitoRequestDTO() {
    }

    public PrestitoRequestDTO(Long idLibro) {
        this.idLibro = idLibro;
    }

    public Long getIdLibro() {
        return idLibro;
    }

    public void setIdLibro(Long idLibro) {
        this.idLibro = idLibro;
    }
}