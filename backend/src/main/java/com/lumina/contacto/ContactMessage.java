package com.lumina.contacto;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.lumina.usuario.AppUser;

@Entity
@Table(name = "contact_message")
public class ContactMessage {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "app_user_id")
  private AppUser user;

  @Column(name = "name", length = 100)
  private String name;

  @Column(name = "email", length = 150)
  private String email;

  @Column(name = "subject", length = 150)
  private String subject;

  @Column(name = "message", columnDefinition = "TEXT")
  private String message;

  @Column(name = "status", length = 30)
  private String status;

  private LocalDateTime createdAt;

  // Fechas automáticas: se llenan solas al guardar o actualizar
  @PrePersist
  void beforeInsert() {
    createdAt = LocalDateTime.now();
  }

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public AppUser getUser() { return user; }
  public void setUser(AppUser user) { this.user = user; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public String getSubject() { return subject; }
  public void setSubject(String subject) { this.subject = subject; }

  public String getMessage() { return message; }
  public void setMessage(String message) { this.message = message; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
