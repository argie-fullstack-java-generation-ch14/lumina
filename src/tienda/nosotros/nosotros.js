// Lumina · nosotros
// Solo esta página.

const sobreNosotrosContent = `
    <h2>SOBRE NOSOTROS</h2>
`

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("sobre-nosotros");
  if (!contenedor) return;

  let html = sobreNosotrosContent;
  contenedor.innerHTML = html;
});
