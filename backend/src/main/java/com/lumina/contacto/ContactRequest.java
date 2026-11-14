package com.lumina.contacto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// Mensaje del formulario de contacto
public record ContactRequest(

    // opcional: si la persona tiene sesión iniciada, llega su id
    Long userId,

    @NotBlank(message = "Escribe tu nombre.")
    @Size(max = 100, message = "El nombre es muy largo.")
    String name,

    @NotBlank(message = "Escribe tu correo electrónico.")
    @Size(max = 150, message = "El correo es muy largo.")
    @Pattern(regexp = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$", message = "Escribe un correo válido, por ejemplo nombre@correo.com.")
    String email,

    @Size(max = 150, message = "El asunto es muy largo.")
    String subject,

    @NotBlank(message = "Escribe tu mensaje.")
    @Size(min = 10, max = 500, message = "El mensaje debe tener entre 10 y 500 caracteres.")
    String message) {
}
