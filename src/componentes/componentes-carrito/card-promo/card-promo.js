// Lumina · card-promo
// Componente: tarjeta promocional "Combina y Ahorra".

const CARD_PROMO_DIR = new URL(".", document.currentScript.src).href;
const LOGO_LUMINA = new URL(
  "../../../assets/img/lumina-logo.svg",
  CARD_PROMO_DIR
).href;

function crearCardPromo() {
  return `
      <div class="card promo-card overflow-hidden border-0 position-relative p-5">
          <div class="row position-relative z-2">
              <div class="col-12 text-center text-md-start">
                  <div class="mb-4">
                      <img
                          src="${LOGO_LUMINA}"
                          alt="Lumina"
                          class="promo-logo"
                          loading="lazy">
                  </div>
                  <h3 class="promo-title mb-4">Combina y Ahorra</h3>
                  <h4 class="promo-subtitle mb-3">Arma tu Kit Personalizado</h4>
                  <p class="promo-desc mb-0">Lleva 3 velas por un precio especial</p>
              </div>
          </div>
          <div class="promo-img-container">
              <img
                  src="https://res.cloudinary.com/dvvwfb2tr/image/upload/v1793322771/generation/lumina/miscelaneas/promo-img_phsmud.png"
                  alt="Vela aromática Lumina"
                  class="promo-img">
          </div>
      </div>
  `;
}
