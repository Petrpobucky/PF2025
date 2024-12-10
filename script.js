const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');

// Nastav rozměry canvas podle velikosti okna
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawScratchLayer();
}

// Inicializace šedé vrstvy
function drawScratchLayer() {
  ctx.fillStyle = '#B0B0B0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Logika pro stírací efekt
let isDrawing = false;

function getPosition(e) {
  const rect = canvas.getBoundingClientRect();
  let x, y;

  if (e.touches) {
    x = e.touches[0].clientX - rect.left;
    y = e.touches[0].clientY - rect.top;
  } else {
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
  }

  return { x, y };
}

function startDrawing(e) {
  isDrawing = true;
  scratch(e);
}

function endDrawing() {
  isDrawing = false;
  ctx.beginPath();
}

function scratch(e) {
  if (!isDrawing) return;

  const { x, y } = getPosition(e);

  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();

  // Kontrola, zda uživatel odhalil velkou část vrstvy
  const revealedRatio = calculateRevealedRatio();
  if (revealedRatio > 0.7) {
    overlay.style.display = 'none'; // Skrýt nápis po dosažení odhalené vrstvy
  }
}

// Funkce na výpočet poměru odhalené plochy
function calculateRevealedRatio() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let revealedPixels = 0;

  for (let i = 3; i < imageData.length; i += 4) {
    if (imageData[i] < 200) revealedPixels++;
  }

  const totalPixels = canvas.width * canvas.height;
  return revealedPixels / totalPixels;
}

// Události pro myš
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', scratch);
canvas.addEventListener('mouseup', endDrawing);
canvas.addEventListener('mouseleave', endDrawing);

// Události pro dotyk
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startDrawing(e);
});
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  scratch(e);
});
canvas.addEventListener('touchend', (e) => {
  e.preventDefault();
  endDrawing();
});

// Resize canvas automaticky
window.addEventListener('resize', resizeCanvas);

// Nastartování po načtení stránky
resizeCanvas();
