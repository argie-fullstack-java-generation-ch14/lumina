package com.lumina.pedido;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserOrderRepository extends JpaRepository<UserOrder, Long> {

  List<UserOrder> findByUserIdOrderByCreatedAtDesc(Long userId);

  List<UserOrder> findAllByOrderByCreatedAtDesc();

}
