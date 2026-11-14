package com.lumina.usuario;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  // POST /api/registro
  @PostMapping("/registro")
  @ResponseStatus(HttpStatus.CREATED)
  public UserResponse register(@Valid @RequestBody RegisterRequest request) {
    return userService.register(request);
  }

  // POST /api/login
  @PostMapping("/login")
  public UserResponse login(@Valid @RequestBody LoginRequest request) {
    return userService.login(request);
  }

  // GET /api/usuarios
  @GetMapping("/usuarios")
  public List<UserResponse> findAll() {
    return userService.findAll();
  }

  // GET /api/usuarios/5
  @GetMapping("/usuarios/{id}")
  public UserResponse findById(@PathVariable Long id) {
    return userService.findById(id);
  }

  // PUT /api/usuarios/5
  @PutMapping("/usuarios/{id}")
  public UserResponse update(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest request) {
    return userService.update(id, request);
  }

  // DELETE /api/usuarios/5
  @DeleteMapping("/usuarios/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    userService.delete(id);
  }
}
