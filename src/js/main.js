// Lumina · main
// Global: init e inyección de los componentes compartidos (header y footer).

document.addEventListener("DOMContentLoaded", async () => {
  await renderPartial("#header", "header/header.html");
  await renderPartial("#footer", "footer/footer.html");
});
