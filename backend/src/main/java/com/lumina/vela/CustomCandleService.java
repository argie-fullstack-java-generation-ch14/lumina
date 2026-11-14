package com.lumina.vela;

import com.lumina.common.ResourceNotFoundException;
import com.lumina.usuario.UserService;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomCandleService {

  private final CustomCandleRepository candles;
  private final UserService userService;

  public CustomCandleService(CustomCandleRepository candles, UserService userService) {
    this.candles = candles;
    this.userService = userService;
  }

  @Transactional
  public CustomCandle create(CustomCandleRequest request) {
    CustomCandle candle = new CustomCandle();
    candle.setUser(userService.getUser(request.userId()));
    candle.setIntention(request.intention().trim());
    candle.setScent(request.scent().trim());
    candle.setDesignColor(request.designColor());
    candle.setMessage(request.message());
    candle.setPreviewImageUrl(request.previewImageUrl());
    candle.setPrice(request.price());
    return candles.save(candle);
  }

  public List<CustomCandle> findByUser(Long userId) {
    userService.getUser(userId);
    return candles.findByUserId(userId);
  }

  public CustomCandle findById(Long id) {
    return candles.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("No existe la vela personalizada " + id + "."));
  }

  @Transactional
  public void delete(Long id) {
    candles.delete(findById(id));
  }
}
