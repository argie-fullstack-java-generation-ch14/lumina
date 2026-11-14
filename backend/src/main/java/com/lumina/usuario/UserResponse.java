package com.lumina.usuario;

import java.time.LocalDateTime;

// Lo que la API devuelve de un usuario. Nunca incluye la contraseña.
public record UserResponse(Long id, String fullName, String phone, String email, String role, LocalDateTime createdAt) {

  public static UserResponse from(AppUser user) {
    String roleName = user.getRole() == null ? null : user.getRole().getName();
    return new UserResponse(user.getId(), user.getFullName(), user.getPhone(), user.getEmail(), roleName, user.getCreatedAt());
  }
}
