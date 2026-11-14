package com.lumina.common;

// Credenciales incorrectas (401)
public class UnauthorizedException extends RuntimeException {

  public UnauthorizedException(String message) {
    super(message);
  }
}
