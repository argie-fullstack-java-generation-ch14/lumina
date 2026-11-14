package com.lumina.contacto;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contacto")
public class ContactController {

  private final ContactService contactService;

  public ContactController(ContactService contactService) {
    this.contactService = contactService;
  }

  // POST /api/contacto
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public ContactMessage create(@Valid @RequestBody ContactRequest request) {
    return contactService.create(request);
  }

  // GET /api/contacto  (para el panel de administración)
  @GetMapping
  public List<ContactMessage> findAll() {
    return contactService.findAll();
  }

  // GET /api/contacto/3
  @GetMapping("/{id}")
  public ContactMessage findById(@PathVariable Long id) {
    return contactService.findById(id);
  }

  // DELETE /api/contacto/3
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    contactService.delete(id);
  }
}
