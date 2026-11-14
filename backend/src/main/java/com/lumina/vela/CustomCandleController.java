package com.lumina.vela;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/velas-personalizadas")
public class CustomCandleController {

  private final CustomCandleService candleService;

  public CustomCandleController(CustomCandleService candleService) {
    this.candleService = candleService;
  }

  // POST /api/velas-personalizadas
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public CustomCandle create(@Valid @RequestBody CustomCandleRequest request) {
    return candleService.create(request);
  }

  // GET /api/velas-personalizadas?usuarioId=2
  @GetMapping
  public List<CustomCandle> findByUser(@RequestParam Long usuarioId) {
    return candleService.findByUser(usuarioId);
  }

  // GET /api/velas-personalizadas/1
  @GetMapping("/{id}")
  public CustomCandle findById(@PathVariable Long id) {
    return candleService.findById(id);
  }

  // DELETE /api/velas-personalizadas/1
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    candleService.delete(id);
  }
}
