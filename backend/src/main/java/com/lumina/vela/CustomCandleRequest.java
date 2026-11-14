package com.lumina.vela;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

// Datos de la vela que se arma en "Crea tu Lumina"
public record CustomCandleRequest(

    @NotNull(message = "El usuario es obligatorio.")
    Long userId,

    @NotBlank(message = "La intención es obligatoria.")
    @Size(max = 80, message = "La intención es muy larga.")
    String intention,

    @NotBlank(message = "El aroma es obligatorio.")
    @Size(max = 120, message = "El aroma es muy largo.")
    String scent,

    @Size(max = 120, message = "El color es muy largo.")
    String designColor,

    @Size(max = 255, message = "El mensaje es muy largo.")
    String message,

    @Size(max = 500, message = "La URL de la imagen es muy larga.")
    String previewImageUrl,

    @NotNull(message = "El precio es obligatorio.")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0.")
    BigDecimal price) {
}
