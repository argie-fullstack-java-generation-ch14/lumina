package com.lumina.common;

import java.util.List;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

// Atrapa los errores de todos los controladores y los convierte en JSON con el código HTTP correcto
@RestControllerAdvice
public class GlobalExceptionHandler {

  private ResponseEntity<ApiError> build(HttpStatus status, String message, List<String> details) {
    return ResponseEntity.status(status).body(ApiError.of(status.value(), status.getReasonPhrase(), message, details));
  }

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ApiError> notFound(ResourceNotFoundException ex) {
    return build(HttpStatus.NOT_FOUND, ex.getMessage(), List.of());
  }

  @ExceptionHandler(ConflictException.class)
  public ResponseEntity<ApiError> conflict(ConflictException ex) {
    return build(HttpStatus.CONFLICT, ex.getMessage(), List.of());
  }

  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<ApiError> badRequest(BadRequestException ex) {
    return build(HttpStatus.BAD_REQUEST, ex.getMessage(), List.of());
  }

  @ExceptionHandler(UnauthorizedException.class)
  public ResponseEntity<ApiError> unauthorized(UnauthorizedException ex) {
    return build(HttpStatus.UNAUTHORIZED, ex.getMessage(), List.of());
  }

  // Falló una validación del @Valid (por ejemplo, un correo mal escrito)
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiError> validation(MethodArgumentNotValidException ex) {
    List<String> details = ex.getBindingResult().getFieldErrors().stream()
        .map(error -> error.getField() + ": " + error.getDefaultMessage())
        .toList();
    return build(HttpStatus.BAD_REQUEST, "Revisa los datos enviados.", details);
  }

  // El JSON viene mal escrito o con un tipo de dato equivocado
  @ExceptionHandler({ HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class })
  public ResponseEntity<ApiError> unreadable(Exception ex) {
    return build(HttpStatus.BAD_REQUEST, "La petición está mal formada.", List.of());
  }

  // Por ejemplo, borrar un producto que ya está en un pedido
  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<ApiError> integrity(DataIntegrityViolationException ex) {
    return build(HttpStatus.CONFLICT, "No se puede completar: hay otros datos que dependen de este registro.", List.of());
  }
}
