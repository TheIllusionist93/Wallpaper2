const { createCanvas } = require('canvas');
const fs = require('fs');

// ═══════════════════════════════════════════════════════════════════
// 🎨 DARK THEME MIT PINK AKZENT
// ═══════════════════════════════════════════════════════════════════

const config = {
  colors: {
    background: '#1a1a1a',      // Dunkel
    pastDays: '#ffffff',         // Weiß für vergangene Tage
    today: '#ec4899',            // Pink für heute
    futureDays: '#404040',       // Dunkelgrau für zukünftige Tage
    monthLines: '#ec4899',       // Pink für Monatslinien
    progressBar: '#ec4899',      // Pink für Fortschrittsbalken
    progressBarBg: '#2d2d2d',    // Dunkel für Balken-Hintergrund
    year: '#6b7280',             // Grau für Jahreszahl
  },
  dots: {
    size: 14,
    spacing: 42,
  },
  layout: {
    verticalOffset: 100,
  },
  progressBar: {
    show: true,
    height: 4,
    distanceFromDots: 40,
  },
  yearLabel: {
    show: true,
    fontSize: 32,
    distanceFromBar: 60,
  },
};

// ═══════════════════════════════════════════════════════════════════
// 📅 DATUM BERECHNEN
// ═══════════════════════════════════════════════════════════════════

const now = new Date();
const start = new Date(now.getFullYear(), 0, 1);
const diff = now - start;
const oneDay = 1000 * 60 * 60 * 24;
const dayOfYear = Math.floor(diff / oneDay) + 1;
const year = now.getFullYear();
const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
const daysInYear = isLeap ? 366 : 365;
const percentage = Math.round((dayOfYear / daysInYear) * 100);

console.log(`📅 Generiere Wallpaper für Tag ${dayOfYear}/${daysInYear} (${percentage}%)`);

// ═══════════════════════════════════════════════════════════════════
// 🖼️ CANVAS ERSTELLEN
// ═══════════════════════════════════════════════════════════════════

const canvas = createCanvas(1170, 2532);
const ctx = canvas.getContext('2d');

// Hintergrund
ctx.fillStyle = config.colors.background;
ctx.fillRect(0, 0, 1170, 2532);

// ═══════════════════════════════════════════════════════════════════
// 📐 GRID BERECHNEN
// ═══════════════════════════════════════════════════════════════════

const cols = 14; // 2 Wochen (7+7)
const dotSize = config.dots.size;
const spacing = config.dots.spacing;
const weekGap = 45; // Lücke zwischen den Wochen

// Grid-Breite mit Lücke
const firstWeekWidth = 6 * spacing + dotSize;
const secondWeekWidth = 6 * spacing + dotSize;
const gridWidth = firstWeekWidth + weekGap + secondWeekWidth;

const gridHeight = Math.ceil(daysInYear / cols) * spacing;
const startX = (1170 - gridWidth) / 2;
const startY = (2532 - gridHeight) / 2 + config.layout.verticalOffset;

// ═══════════════════════════════════════════════════════════════════
// 🔵 PUNKTE ZEICHNEN
// ═══════════════════════════════════════════════════════════════════

for (let i = 0; i < daysInYear; i++) {
  const row = Math.floor(i / cols);
  const col = i % cols;
  
  // X-Position mit Lücke nach 7 Punkten
  let x;
  if (col < 7) {
    x = startX + col * spacing + dotSize / 2;
  } else {
    x = startX + firstWeekWidth + weekGap + (col - 7) * spacing + dotSize / 2;
  }
  
  const y = startY + row * spacing + dotSize / 2;

  ctx.beginPath();
  ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);

  if (i < dayOfYear - 1) {
    ctx.fillStyle = config.colors.pastDays;
  } else if (i === dayOfYear - 1) {
    ctx.fillStyle = config.colors.today;
  } else {
    ctx.fillStyle = config.colors.futureDays;
  }
  
  ctx.fill();
}

// ═══════════════════════════════════════════════════════════════════
// 📏 MONATSLINIEN ZEICHNEN (PINK) - MIT HORIZONTALEN LINIEN
// ═══════════════════════════════════════════════════════════════════

const daysPerMonth = isLeap 
  ? [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

ctx.strokeStyle = config.colors.monthLines;
ctx.lineWidth = 2;
ctx.globalAlpha = 0.5;

let cumulativeDays = 0;

for (let monthIndex = 0; monthIndex < daysPerMonth.length - 1; monthIndex++) {
  cumulativeDays += daysPerMonth[monthIndex];
  const lastDayOfMonth = cumulativeDays - 1;
  
  if (lastDayOfMonth >= daysInYear) break;
  
  const row = Math.floor(lastDayOfMonth / cols);
  const col = lastDayOfMonth % cols;
  
  // Position des letzten Punkts des Monats
  let lastX;
  if (col < 7) {
    lastX = startX + col * spacing + dotSize / 2;
  } else {
    lastX = startX + firstWeekWidth + weekGap + (col - 7) * spacing + dotSize / 2;
  }
  const lastY = startY + row * spacing + dotSize / 2;
  
  const firstDayNextMonth = cumulativeDays;
  if (firstDayNextMonth < daysInYear) {
    const nextRow = Math.floor(firstDayNextMonth / cols);
    const nextCol = firstDayNextMonth % cols;
    
    let nextX;
    if (nextCol < 7) {
      nextX = startX + nextCol * spacing + dotSize / 2;
    } else {
      nextX = startX + firstWeekWidth + weekGap + (nextCol - 7) * spacing + dotSize / 2;
    }
    const nextY = startY + nextRow * spacing + dotSize / 2;
    
    if (nextRow > row) {
      // Monat wechselt Reihe - große S-Linie
      ctx.beginPath();
      ctx.moveTo(startX - 10, lastY + spacing / 2);
      ctx.lineTo(startX + gridWidth + 10, lastY + spacing / 2);
      ctx.lineTo(startX + gridWidth + 10, nextY - spacing / 2);
      ctx.lineTo(startX - 10, nextY - spacing / 2);
      ctx.stroke();
    } else {
      // Monat bleibt in gleicher Reihe - S-Linie: ____|¯¯¯¯
      ctx.beginPath();
      // Horizontale Linie links vom letzten Punkt bis zum Trennstrich (UNTEN)
      ctx.moveTo(startX - 10, lastY + spacing / 2);
      ctx.lineTo(lastX + spacing / 2, lastY + spacing / 2);
      // Vertikaler Strich (nach oben)
      ctx.lineTo(lastX + spacing / 2, lastY - spacing / 2);
      // Horizontale Linie weiter nach rechts (OBEN)
      ctx.lineTo(startX + gridWidth + 10, lastY - spacing / 2);
      ctx.stroke();
    }
  }
}

ctx.globalAlpha = 1.0;

// ═══════════════════════════════════════════════════════════════════
// 📊 FORTSCHRITTSBALKEN (PINK)
// ═══════════════════════════════════════════════════════════════════

if (config.progressBar.show) {
  const barWidth = gridWidth;
  const barHeight = config.progressBar.height;
  const barX = startX;
  const barY = startY + gridHeight + config.progressBar.distanceFromDots;

  // Hintergrund
  ctx.fillStyle = config.colors.progressBarBg;
  ctx.fillRect(barX, barY, barWidth, barHeight);

  // Fortschritt (Pink)
  ctx.fillStyle = config.colors.progressBar;
  ctx.fillRect(barX, barY, (barWidth * percentage) / 100, barHeight);
  
  // Jahreszahl
  if (config.yearLabel.show) {
    ctx.fillStyle = config.colors.year;
    ctx.font = `${config.yearLabel.fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(year.toString(), 585, barY + config.yearLabel.distanceFromBar);
  }
}

// ═══════════════════════════════════════════════════════════════════
// 💾 PNG SPEICHERN
// ═══════════════════════════════════════════════════════════════════

const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('wallpaper-dark.png', buffer);

console.log('✅ Wallpaper erfolgreich erstellt: wallpaper-dark-pink.png');
console.log(`   ${percentage}% des Jahres ${year} sind vergangen`);