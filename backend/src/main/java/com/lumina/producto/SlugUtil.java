package com.lumina.producto;

import java.text.Normalizer;

// Convierte un texto en un slug para la URL: "Noche de Paz" -> "noche-de-paz"
public final class SlugUtil {

  private SlugUtil() {
  }

  public static String toSlug(String text) {
    // quito las tildes: á -> a
    String clean = Normalizer.normalize(text, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
    return clean.toLowerCase().trim().replaceAll("[^a-z0-9]+", "-").replaceAll("(^-+|-+$)", "");
  }
}
