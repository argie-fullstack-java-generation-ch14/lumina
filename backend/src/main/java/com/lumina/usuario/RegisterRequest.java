package com.lumina.usuario;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// Datos que llegan desde el formulario de registro.
// Las reglas son las mismas que valida el JavaScript del frontend.
public record RegisterRequest(

    @NotBlank(message = "Escribe tu nombre completo.")
    @Size(max = 100, message = "El nombre es muy largo.")
    @Pattern(regexp = "^[\\p{L}][\\p{L}'.-]*(\\s+[\\p{L}][\\p{L}'.-]*)+$", message = "Escribe tu nombre y tu apellido, solo con letras.")
    String fullName,

    @NotBlank(message = "Escribe tu número de teléfono.")
    @Pattern(regexp = "^\\+?[0-9\\s()-]{7,20}$", message = "El teléfono solo puede tener números, espacios, guiones y el signo +.")
    String phone,

    @NotBlank(message = "Escribe tu correo electrónico.")
    @Size(max = 150, message = "El correo es muy largo.")
    @Pattern(regexp = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$", message = "Escribe un correo válido, por ejemplo nombre@correo.com.")
    String email,

    @NotBlank(message = "Escribe una contraseña.")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).{8,64}$", message = "La contraseña debe tener entre 8 y 64 caracteres, con al menos una letra y un número.")
    String password) {
}
