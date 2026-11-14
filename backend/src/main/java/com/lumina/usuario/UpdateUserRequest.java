package com.lumina.usuario;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// Lo que una persona puede cambiar de su perfil
public record UpdateUserRequest(

    @NotBlank(message = "Escribe tu nombre completo.")
    @Size(max = 100, message = "El nombre es muy largo.")
    String fullName,

    @NotBlank(message = "Escribe tu número de teléfono.")
    @Pattern(regexp = "^\\+?[0-9\\s()-]{7,20}$", message = "El teléfono solo puede tener números, espacios, guiones y el signo +.")
    String phone) {
}
