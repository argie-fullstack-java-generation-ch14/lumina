package com.lumina.vela;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CustomCandleRepository extends JpaRepository<CustomCandle, Long> {

  List<CustomCandle> findByUserId(Long userId);

}
