const CARD_RECICLA_DIR = new URL(".", document.currentScript.src).href;
const LOGO_RECICLA = new URL(
  "../../../assets/img/lumina-logo.svg",
  CARD_RECICLA_DIR
).href;

function crearCardRecicla() {
  return `
    <section>
      <div class="card promo-card recicla-card overflow-hidden border-0 position-relative p-5">
        <div class="promo-header text-center">
          <div class="mb-4">
            <img src="${LOGO_RECICLA}" alt="Lumina" class="promo-logo" loading="lazy">
          </div>
          <h3 class="promo-title mb-0">Compromiso sostenible</h3>
        </div>

          <p class="promo-subtitle mt-4 mb-3 text-center text-md-start">Nuestros frascos de vidrio son 100% reutilizables como macetas, porta objetos o lapiceros una vez terminada la cera.
          </p>

        <div class="promo-img-container">
          <img src="https://res.cloudinary.com/dvvwfb2tr/image/upload/v1793379124/generation/lumina/miscelaneas/recicla_ueniqq.png" alt="Vela aromática Lumina" class="promo-img">
        </div>
      </div>
    </section>
  `;
}
