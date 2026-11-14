package com.lumina.contacto;

import com.lumina.common.ResourceNotFoundException;
import com.lumina.usuario.UserService;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactService {

  private final ContactMessageRepository messages;
  private final UserService userService;

  public ContactService(ContactMessageRepository messages, UserService userService) {
    this.messages = messages;
    this.userService = userService;
  }

  @Transactional
  public ContactMessage create(ContactRequest request) {
    ContactMessage message = new ContactMessage();
    if (request.userId() != null) {
      message.setUser(userService.getUser(request.userId()));
    }
    message.setName(request.name().trim());
    message.setEmail(request.email().trim().toLowerCase());
    message.setSubject(request.subject());
    message.setMessage(request.message().trim());
    message.setStatus("NEW"); // NEW = nuevo, todavía sin responder
    return messages.save(message);
  }

  public List<ContactMessage> findAll() {
    return messages.findAllByOrderByCreatedAtDesc();
  }

  public ContactMessage findById(Long id) {
    return messages.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("No existe el mensaje " + id + "."));
  }

  @Transactional
  public void delete(Long id) {
    messages.delete(findById(id));
  }
}
