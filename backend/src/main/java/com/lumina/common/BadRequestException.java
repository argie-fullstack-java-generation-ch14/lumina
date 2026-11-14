package com.lumina.common;

// Datos que no se pueden procesar (400)
public class BadRequestException extends RuntimeException {

  public BadRequestException(String message) {
    super(message);
  }
}
