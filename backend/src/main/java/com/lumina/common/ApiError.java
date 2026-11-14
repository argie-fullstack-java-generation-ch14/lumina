package com.lumina.common;

import java.time.LocalDateTime;
import java.util.List;

// Así se ve cualquier error que devuelve la API
public record ApiError(int status, String error, String message, List<String> details, LocalDateTime timestamp) {

  public static ApiError of(int status, String error, String message, List<String> details) {
    return new ApiError(status, error, message, details, LocalDateTime.now());
  }
}
