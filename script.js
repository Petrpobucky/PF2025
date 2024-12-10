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

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

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

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', scratch);
canvas.addEventListener('mouseup', endDrawing);
canvas.addEventListener('mouseleave', endDrawing);

// Resize canvas automaticky
window.addEventListener('resize', resizeCanvas);

// Nastartování po načtení stránky
resizeCanvas();
