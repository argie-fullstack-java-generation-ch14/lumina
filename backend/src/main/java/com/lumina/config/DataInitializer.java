package com.lumina.config;

import com.lumina.pedido.OrderStatus;
import com.lumina.pedido.OrderStatusRepository;
import com.lumina.usuario.Role;
import com.lumina.usuario.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// Al arrancar, crea los roles y los estados de pedido si todavía no existen.
// Así el registro y los pedidos funcionan aunque no se haya corrido el 02_seed.sql.
@Configuration
public class DataInitializer {

  @Bean
  CommandLineRunner createBasicData(RoleRepository roles, OrderStatusRepository statuses) {
    return args -> {
      createRole(roles, "ADMIN", "Gestiona productos, pedidos y usuarios.");
      createRole(roles, "CUSTOMER", "Compra productos y administra sus favoritos.");
      createRole(roles, "STAFF", "Apoya la gestion de pedidos.");

      createStatus(statuses, "PENDING", "Pedido creado y pendiente de revision.");
      createStatus(statuses, "CONFIRMED", "Pedido confirmado.");
      createStatus(statuses, "PREPARING", "Pedido en preparacion.");
      createStatus(statuses, "COMPLETED", "Pedido entregado o finalizado.");
      createStatus(statuses, "CANCELLED", "Pedido cancelado.");
    };
  }

  private void createRole(RoleRepository roles, String name, String description) {
    if (roles.findByName(name).isEmpty()) {
      Role role = new Role();
      role.setName(name);
      role.setDescription(description);
      roles.save(role);
    }
  }

  private void createStatus(OrderStatusRepository statuses, String name, String description) {
    if (statuses.findByName(name).isEmpty()) {
      OrderStatus status = new OrderStatus();
      status.setName(name);
      status.setDescription(description);
      statuses.save(status);
    }
  }
}
