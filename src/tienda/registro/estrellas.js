// Lumina · registro
// Destellos de estrellas que flotan y brillan sobre el fondo de la página.

function createStars(canvas) {
  const ctx = canvas.getContext('2d');
  const colors = ['#8F78D9', '#AD784E', '#7C9474'];
  const fadeTime = 1000;

  let stars = [];
  let width = 0;
  let height = 0;
  let animation = 0;
  let lastTime = 0;

  function makeStar() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: 3 + Math.random() * 7,
      speedX: 10 + Math.random() * 25,
      speedY: -(3 + Math.random() * 10),
      phase: Math.random() * Math.PI * 2,
      blink: 1 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  }

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const amount = Math.min(Math.max(Math.round((width * height) / 9000), 50), 160);
    stars = [];
    for (let i = 0; i < amount; i++) {
      stars.push(makeStar());
    }
  }

  function drawStar(star, shine) {
    const size = star.size * (0.5 + 0.5 * shine);

    ctx.globalAlpha = 0.15 + 0.85 * shine;
    ctx.fillStyle = star.color;
    ctx.shadowColor = star.color;
    ctx.shadowBlur = shine > 0.6 ? 8 : 0;

    ctx.beginPath();
    ctx.moveTo(star.x, star.y - size);
    ctx.quadraticCurveTo(star.x, star.y, star.x + size, star.y);
    ctx.quadraticCurveTo(star.x, star.y, star.x, star.y + size);
    ctx.quadraticCurveTo(star.x, star.y, star.x - size, star.y);
    ctx.quadraticCurveTo(star.x, star.y, star.x, star.y - size);
    ctx.fill();
  }

  function draw(time) {
    const seconds = time / 1000;
    const delta = Math.min(seconds - lastTime, 0.05);
    lastTime = seconds;

    ctx.clearRect(0, 0, width, height);

    stars.forEach((star) => {
      star.x += star.speedX * delta;
      star.y += star.speedY * delta;

      if (star.x > width + 20) {
        star.x = -20;
      }
      if (star.y < -20) {
        star.y = height + 20;
      }

      const shine = Math.pow((Math.sin(seconds * star.blink + star.phase) + 1) / 2, 4);
      drawStar(star, shine);
    });

    animation = requestAnimationFrame(draw);
  }

  function start() {
    resize();
    window.addEventListener('resize', resize);
    canvas.classList.add('is-visible');
    animation = requestAnimationFrame(draw);
  }

  function fadeOut() {
    canvas.classList.remove('is-visible');

    return new Promise((resolve) => {
      setTimeout(() => {
        cancelAnimationFrame(animation);
        window.removeEventListener('resize', resize);
        ctx.clearRect(0, 0, width, height);
        resolve();
      }, fadeTime);
    });
  }

  return { start, fadeOut };
}
