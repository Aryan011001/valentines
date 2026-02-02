const zone = document.getElementById("zone");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const result = document.getElementById("result");
const hint = document.getElementById("hint");
const backBtn = document.getElementById("backBtn");
const noReturn = document.getElementById("noReturn");

const heartsContainer = document.getElementById("heartsContainer");
function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart-bg");
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration = Math.random() * 3 + 4 + "s";
  heart.style.width = Math.random() * 20 + 10 + "px";
  heart.style.height = heart.style.width;
  heartsContainer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 7000);
}
setInterval(createHeart, 600);

const confettiCanvas = document.getElementById("confettiCanvas");

function resizeConfettiCanvas() {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  confettiCanvas.width = Math.floor(window.innerWidth * dpr);
  confettiCanvas.height = Math.floor(window.innerHeight * dpr);
  confettiCanvas.style.width = "100vw";
  confettiCanvas.style.height = "100vh";
}

resizeConfettiCanvas();
window.addEventListener("resize", resizeConfettiCanvas);
window.addEventListener("orientationchange", () => setTimeout(resizeConfettiCanvas, 150));

const confettiInstance = confetti.create(confettiCanvas, {
  resize: false,
  useWorker: true
});

function fullScreenConfetti() {
  const end = Date.now() + 1600;

  (function frame() {
    confettiInstance({
      particleCount: 12,
      spread: 90,
      startVelocity: 45,
      ticks: 180,
      origin: { x: Math.random(), y: Math.random() * 0.3 }
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();

  setTimeout(() => {
    confettiInstance({
      particleCount: 300,
      spread: 140,
      startVelocity: 60,
      ticks: 220,
      origin: { x: 0.5, y: 0.55 }
    });
  }, 300);
}

let yesScale = 1;
function growYes() {
  yesScale = Math.min(2.2, yesScale + 0.1);
  yesBtn.style.transform = `translateY(-50%) scale(${yesScale})`;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function moveNo(px, py) {
  const z = zone.getBoundingClientRect();
  const b = noBtn.getBoundingClientRect();

  let dx = (b.left + b.width / 2) - px;
  let dy = (b.top + b.height / 2) - py;
  let mag = Math.hypot(dx, dy) || 1;
  dx /= mag;
  dy /= mag;

  let newLeft = (b.left - z.left) + dx * 150;
  let newTop = (b.top - z.top) + dy * 150;

  newLeft = clamp(newLeft, 0, z.width - b.width);
  newTop = clamp(newTop, 0, z.height - b.height);

  noBtn.style.left = newLeft + "px";
  noBtn.style.top = newTop + "px";
  noBtn.style.transform = "none";

  growYes();
}

zone.addEventListener("pointermove", e => {
  const b = noBtn.getBoundingClientRect();
  const d = Math.hypot(
    (b.left + b.width / 2) - e.clientX,
    (b.top + b.height / 2) - e.clientY
  );
  if (d < 140) moveNo(e.clientX, e.clientY);
});

noBtn.addEventListener("click", e => e.preventDefault());

/* Support for mobile touch: run away on tap */
noBtn.addEventListener("touchstart", e => {
  e.preventDefault();
  moveNo(e.touches[0].clientX, e.touches[0].clientY);
});

yesBtn.addEventListener("click", () => {
  zone.style.display = "none";
  hint.style.display = "none";
  result.style.display = "block";
  resizeConfettiCanvas();
  fullScreenConfetti();
});

// Fake Back Button Logic
backBtn.addEventListener("click", () => {
  result.style.display = "none";
  noReturn.style.display = "block";
  // Hide Title and Art
  document.querySelector('h1').style.display = 'none';
  document.querySelector('.art').style.display = 'none';
});
