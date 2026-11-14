package com.lumina.common;

// No existe lo que se pidió (404)
public class ResourceNotFoundException extends RuntimeException {

  public ResourceNotFoundException(String message) {
    super(message);
  }
}
