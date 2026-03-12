// ================================
// URL PARAMS
// ================================
const params = new URLSearchParams(window.location.search);
const name = params.get("name") || "Bestie";
let candleCount = parseInt(params.get("candles")) || 4;
candleCount = Math.min(Math.max(candleCount, 1), 30);


// ================================
// ELEMENTS
// ================================
const birthdayText = document.getElementById("birthdayText");
const cake = document.getElementById("cake");
const ribbon = document.getElementById("ribbon");
const introScreen = document.getElementById("intro-screen");
const cakeScreen = document.getElementById("cake-screen");
const bgMusic = document.getElementById("bgMusic");

// ================================
// PRELOAD MUSIC
// ================================
window.addEventListener("DOMContentLoaded", () => {

  if (bgMusic) {
    bgMusic.volume = 0.5;
    bgMusic.muted = true;

    bgMusic.play()
      .then(() => {
        bgMusic.muted = false;
      })
      .catch(() => {
        console.log("Autoplay blocked until interaction.");
      });
  }

});

// ================================
// BUTTERFLY CLICK - SHOW CAKE
// ================================
ribbon.addEventListener("click", () => {

  if (bgMusic) {
    bgMusic.play().catch(() => {});
  }

  introScreen.classList.add("slide-left");
  cakeScreen.classList.add("show-cake");

  birthdayText.innerHTML = `
    <div id="mainTitle">Happy Birthday, ${name}! 🎉</div>
    <div id="subTitle">Make a wish and blow the candles 🎂</div>
  `;

});

// ================================
// CONFETTI
// ================================
const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const confettiColors = [
  "#ffd6f6","#ffc8dd","#ffdee9","#f8c8ff","#e6ccff",
  "#d8b4ff","#f8e8ff","#e0f7ff","#d6faff","#d4ffe6",
  "#faffd6","#fff0f6","#ffffff"
];

const confetti = [];

for (let i = 0; i < 120; i++) {
  confetti.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 6 + 3,
    speed: Math.random() * 3 + 1,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)]
  });
}

function drawConfetti() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confetti.forEach(c => {

    ctx.fillStyle = c.color;
    ctx.fillRect(c.x, c.y, c.size, c.size);

    c.y += c.speed;

    if (c.y > canvas.height) {
      c.y = -10;
      c.x = Math.random() * canvas.width;
    }

  });

  requestAnimationFrame(drawConfetti);
}

drawConfetti();

window.addEventListener("resize", () => {

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

});

// ================================
// CAKE + CANDLES
// ================================
const candleColors = [
  "green-candle",
  "purple-candle",
  "blue-candle",
  "yellow-candle"
];

const CAKE_VISUAL_WIDTH = 35;

function createCandles(count) {

  cake.innerHTML = "";

  const CANDLE_VISUAL_WIDTH = 2;
  const candlesPerRow = 6;
  const shiftAmount = 4;

  for (let i = 0; i < count; i++) {

    const candle = document.createElement("div");
    candle.classList.add("candle");

    const colorClass =
      candleColors[Math.floor(Math.random() * candleColors.length)];

    candle.classList.add(colorClass);

    const row = Math.floor(i / candlesPerRow);
    const col = i % candlesPerRow;

    const totalCandlesInRow =
      Math.min(candlesPerRow, count - row * candlesPerRow);

    const rowSpacing =
      CAKE_VISUAL_WIDTH / (totalCandlesInRow + 1);

    const leftBase =
      rowSpacing * (col + 1) - CANDLE_VISUAL_WIDTH / 2 + 5;

    const rowShift = row % 2 === 0 ? 0 : shiftAmount;

    candle.style.position = "absolute";
    candle.style.top = `${10 + row * 3}px`;
    candle.style.left = `${leftBase - rowShift + 4}px`;

    cake.appendChild(candle);

  }

}

createCandles(candleCount);

// ================================
// MICROPHONE BLOW DETECTION
// ================================
async function startMicDetection() {

  try {

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });

    const audioContext =
      new (window.AudioContext || window.webkitAudioContext)();

    const source = audioContext.createMediaStreamSource(stream);

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;

    source.connect(analyser);

    const dataArray =
      new Uint8Array(analyser.frequencyBinCount);

    let blown = false;

    function detectBlow() {

      analyser.getByteFrequencyData(dataArray);

      let highFreqSum = 0;
      let lowFreqSum = 0;

      const midpoint = dataArray.length / 2;

      for (let i = 0; i < dataArray.length; i++) {

        if (i < midpoint) {
          lowFreqSum += dataArray[i];
        } else {
          highFreqSum += dataArray[i];
        }

      }

      const highAvg =
        highFreqSum / (dataArray.length / 2);

      const lowAvg =
        lowFreqSum / (dataArray.length / 2);

      const ratio = highAvg / (lowAvg + 1);

      if (ratio > 0.5 && !blown) {

        blown = true;
        blowOutCandles();

      }

      requestAnimationFrame(detectBlow);

    }

    detectBlow();

  } catch (err) {

    console.error("Mic access error:", err);

  }

}

startMicDetection();

// ================================
// BLOW OUT CANDLES
// ================================
function blowOutCandles() {

  const candles = document.querySelectorAll(".candle");

  candles.forEach(candle => {

    const delay = Math.random() * 1000;

    setTimeout(() => {

      candle.classList.add("blown");

    }, delay);

  });

  setTimeout(() => {

    const subTitle = document.getElementById("subTitle");

    subTitle.textContent =
      "Yayy! Wishing you the happiest birthday ever!! 🎉";

  }, 1200);

}

// Blow detection
async function startMicDetection() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let blown = false;

    function detectBlow() {
      analyser.getByteFrequencyData(dataArray);

      let highFreqSum = 0;
      let lowFreqSum = 0;
      const midpoint = dataArray.length / 2;

      for (let i = 0; i < dataArray.length; i++) {
        if (i < midpoint) lowFreqSum += dataArray[i];
        else highFreqSum += dataArray[i];
      }

      const highAvg = highFreqSum / (dataArray.length / 2);
      const lowAvg = lowFreqSum / (dataArray.length / 2);
      const ratio = highAvg / (lowAvg + 1);

      if (ratio > 0.5 && !blown) {
        blown = true;
        blowOutCandles();
      }

      requestAnimationFrame(detectBlow);
    }

    detectBlow();
  } catch (err) {
    console.error("Mic access error:", err);
  }
}

// Blow out candles animation
function blowOutCandles() {
  const candles = document.querySelectorAll(".candle");
  candles.forEach(candle => {
    const delay = Math.random() * 1000;
    setTimeout(() => {
      candle.classList.add("blown"); // CSS will hide or animate the candle flame
    }, delay);
  });

  setTimeout(() => {
    const subTitle = document.getElementById("subTitle");
    subTitle.textContent = "Yayy! Wishing you the happiest birthday ever!! 🎉";
  }, 1200);
}

const btnBack = document.getElementById("btnBack");
const btnMessage = document.getElementById("btnMessage");
const btnSurprise = document.getElementById("btnSurprise");

btnBack.addEventListener("click", () => {
  // Slide back to intro screen
  document.getElementById("cake-screen").classList.remove("show-cake");
  document.getElementById("intro-screen").classList.remove("slide-left");
});


window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("show") === "cake") {
    const introScreen = document.getElementById("intro-screen");
    const cakeScreen = document.getElementById("cake-screen");

    if (introScreen && cakeScreen) {
      introScreen.classList.add("slide-left");
      cakeScreen.classList.add("show-cake");
    }
  }
});
