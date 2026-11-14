package com.lumina.usuario;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(

    @NotBlank(message = "Escribe tu correo electrónico.")
    String email,

    @NotBlank(message = "Escribe tu contraseña.")
    String password) {
}
