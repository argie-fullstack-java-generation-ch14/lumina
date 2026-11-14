package com.lumina.producto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRequest(

    @NotBlank(message = "El nombre es obligatorio.")
    @Size(max = 80, message = "El nombre es muy largo.")
    String name,

    @Size(max = 255, message = "La descripción es muy larga.")
    String description,

    // EXPERIENCE (bienestar, descanso...) o SEASON (navidad, halloween...)
    @Size(max = 30, message = "El tipo es muy largo.")
    String categoryType,

    Boolean active) {
}
