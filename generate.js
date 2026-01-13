const { createCanvas } = require('canvas');
const fs = require('fs');

// ═══════════════════════════════════════════════════════════════════
// 🎨 DESIGN-VORLAGEN - HIER KANNST DU VERSCHIEDENE DESIGNS ANLEGEN
// ═══════════════════════════════════════════════════════════════════

const DESIGNS = {
  // Design 1: Hell & Minimalistisch (Dein aktuelles)
  light: {
    name: 'Light & Minimalistic',
    colors: {
      background: '#f5f5f0',
      pastDays: '#2d2d2d',
      today: '#4ade80',
      futureDays: '#d4d4d4',
      progressBar: '#4ade80',
      progressBarBg: '#e5e5e5',
      year: '#9ca3af',
    },
    dots: {
      size: 14,
      spacing: 42,
      columns: 21,
    },
    position: {
      verticalOffset: -50,
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
  },

  // Design 2: Dunkel (Dark Mode)
  dark: {
    name: 'Dark Mode',
    colors: {
      background: '#1a1a1a',
      pastDays: '#ffffff',
      today: '#60a5fa',
      futureDays: '#404040',
      progressBar: '#60a5fa',
      progressBarBg: '#2d2d2d',
      year: '#6b7280',
    },
    dots: {
      size: 14,
      spacing: 42,
      columns: 21,
    },
    position: {
      verticalOffset: -50,
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
  },

  // Design 3: Rosa/Pink
  pink: {
    name: 'Pink Pastel',
    colors: {
      background: '#fff5f5',
      pastDays: '#4a5568',
      today: '#f472b6',
      futureDays: '#e5e7eb',
      progressBar: '#f472b6',
      progressBarBg: '#fce7f3',
      year: '#9ca3af',
    },
    dots: {
      size: 14,
      spacing: 42,
      columns: 21,
    },
    position: {
      verticalOffset: -50,
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
  },

  // Design 4: Blau/Ocean
  ocean: {
    name: 'Ocean Blue',
    colors: {
      background: '#f0f9ff',
      pastDays: '#1e3a8a',
      today: '#0ea5e9',
      futureDays: '#bfdbfe',
      progressBar: '#0ea5e9',
      progressBarBg: '#dbeafe',
      year: '#64748b',
    },
    dots: {
      size: 14,
      spacing: 42,
      columns: 21,
    },
    position: {
      verticalOffset: -50,
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
  },

  // Design 5: Minimalistisch Schwarz-Weiß
  minimal: {
    name: 'Pure Black & White',
    colors: {
      background: '#ffffff',
      pastDays: '#000000',
      today: '#ef4444',
      futureDays: '#e5e5e5',
      progressBar: '#000000',
      progressBarBg: '#f3f4f6',
      year: '#9ca3af',
    },
    dots: {
      size: 14,
      spacing: 42,
      columns: 21,
    },
    position: {
      verticalOffset: -50,
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
  },

  // Design 6: Kleiner & kompakter (für kleinere iPhones)
  compact: {
    name: 'Compact',
    colors: {
      background: '#fafaf9',
      pastDays: '#292524',
      today: '#22c55e',
      futureDays: '#d6d3d1',
      progressBar: '#22c55e',
      progressBarBg: '#e7e5e4',
      year: '#78716c',
    },
    dots: {
      size: 12,             // Kleinere Punkte
      spacing: 38,          // Weniger Abstand
      columns: 21,
    },
    position: {
      verticalOffset: -30,
    },
    progressBar: {
      show: true,
      height: 3,
      distanceFromDots: 35,
    },
    yearLabel: {
      show: true,
      fontSize: 28,
      distanceFromBar: 50,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════
// 🔧 GENERATOR-FUNKTION
// ═══════════════════════════════════════════════════════════════════

function generateWallpaper(config, filename) {
  // Datum berechnen
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay) + 1;
  const year = now.getFullYear();
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  const daysInYear = isLeap ? 366 : 365;
  const percentage = Math.round((dayOfYear / daysInYear) * 100);

  // Canvas erstellen
  const canvas = createCanvas(1170, 2532);
  const ctx = canvas.getContext('2d');

  // Hintergrund
  ctx.fillStyle = config.colors.background;
  ctx.fillRect(0, 0, 1170, 2532);

  // Grid berechnen
  const cols = 14; // 2 Wochen (7+7)
  const dotSize = config.dots.size;
  const spacing = config.dots.spacing;
  const weekGap = 35; // Größere Lücke zwischen den Wochen
  
  // Berechne Grid-Breite mit Lücke
  const firstWeekWidth = 6 * spacing + dotSize; // 7 Punkte
  const secondWeekWidth = 6 * spacing + dotSize; // 7 Punkte
  const gridWidth = firstWeekWidth + weekGap + secondWeekWidth;
  
  const gridHeight = Math.ceil(daysInYear / cols) * spacing;
  const startX = (1170 - gridWidth) / 2;
  const startY = (2532 - gridHeight) / 2 + config.position.verticalOffset;

  // Punkte zeichnen mit Wochen-Lücke
  for (let i = 0; i < daysInYear; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    
    // X-Position mit Lücke nach 7 Punkten
    let x;
    if (col < 7) {
      // Erste Woche
      x = startX + col * spacing + dotSize / 2;
    } else {
      // Zweite Woche (mit Lücke)
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

  // Monatslinien zeichnen (exakte Monatswechsel)
  const monthEnds = [31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]; // Ende jedes Monats (nicht-Schaltjahr)
  const monthEndsLeap = [31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335]; // Schaltjahr
  const monthDays = isLeap ? monthEndsLeap : monthEnds;
  
  ctx.strokeStyle = config.colors.progressBar; // Nutze die Akzentfarbe
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.4;
  
  monthDays.forEach(day => {
    if (day >= daysInYear) return;
    
    const row = Math.floor(day / cols);
    const col = day % cols;
    
    // Berechne Position des letzten Punkts im Monat
    let lastX;
    if (col < 7) {
      lastX = startX + col * spacing + dotSize / 2;
    } else {
      lastX = startX + firstWeekWidth + weekGap + (col - 7) * spacing + dotSize / 2;
    }
    const lastY = startY + row * spacing + dotSize / 2;
    
    // Wenn nächste Reihe existiert (Monat geht weiter)
    if (day + 1 < daysInYear) {
      const nextRow = Math.floor((day + 1) / cols);
      
      if (nextRow > row) {
        // Monat wechselt in neue Reihe - zeichne eckiges "S"
        
        const nextCol = (day + 1) % cols;
        let nextX;
        if (nextCol < 7) {
          nextX = startX + nextCol * spacing + dotSize / 2;
        } else {
          nextX = startX + firstWeekWidth + weekGap + (nextCol - 7) * spacing + dotSize / 2;
        }
        const nextY = startY + nextRow * spacing + dotSize / 2;
        
        // Teil 1: Horizontale Linie UNTERHALB der aktuellen Reihe (vom letzten Punkt bis zum Ende)
        const lineY1 = lastY + spacing / 2;
        ctx.beginPath();
        ctx.moveTo(lastX + spacing / 2, lineY1);
        ctx.lineTo(startX + gridWidth + 10, lineY1);
        ctx.stroke();
        
        // Teil 2: Vertikale Linie rechts (runter zur nächsten Reihe)
        const verticalX = startX + gridWidth + 10;
        ctx.beginPath();
        ctx.moveTo(verticalX, lineY1);
        ctx.lineTo(verticalX, nextY - spacing / 2);
        ctx.stroke();
        
        // Teil 3: Horizontale Linie OBERHALB der neuen Reihe (vom Ende bis zum ersten neuen Punkt)
        const lineY2 = nextY - spacing / 2;
        ctx.beginPath();
        ctx.moveTo(verticalX, lineY2);
        ctx.lineTo(nextX - spacing / 2, lineY2);
        ctx.stroke();
        
        // Teil 4: Vertikale Linie beim neuen Punkt (runter zum Punkt)
        ctx.beginPath();
        ctx.moveTo(nextX - spacing / 2, lineY2);
        ctx.lineTo(nextX - spacing / 2, nextY);
        ctx.stroke();
      } else {
        // Monat endet in derselben Reihe - nur kurze vertikale Linie
        const verticalX = lastX + spacing / 2;
        
        ctx.beginPath();
        ctx.moveTo(verticalX, lastY - spacing / 2);
        ctx.lineTo(verticalX, lastY + spacing / 2);
        ctx.stroke();
      }
    }
  });
  
  ctx.globalAlpha = 1.0;

  // Fortschrittsbalken (optional)
  if (config.progressBar.show) {
    const barWidth = gridWidth;
    const barHeight = config.progressBar.height;
    const barX = startX;
    const barY = startY + gridHeight + config.progressBar.distanceFromDots;

    // Hintergrund
    ctx.fillStyle = config.colors.progressBarBg;
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // Fortschritt
    ctx.fillStyle = config.colors.progressBar;
    ctx.fillRect(barX, barY, (barWidth * percentage) / 100, barHeight);
    
    // Jahreszahl (optional)
    if (config.yearLabel.show) {
      ctx.fillStyle = config.colors.year;
      ctx.font = `${config.yearLabel.fontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(year.toString(), 585, barY + config.yearLabel.distanceFromBar);
    }
  } else if (config.yearLabel.show) {
    const barY = startY + gridHeight + config.progressBar.distanceFromDots;
    ctx.fillStyle = config.colors.year;
    ctx.font = `${config.yearLabel.fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(year.toString(), 585, barY);
  }

  // Als PNG speichern
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filename, buffer);
  
  return { dayOfYear, daysInYear, percentage };
}

// ═══════════════════════════════════════════════════════════════════
// 🚀 ALLE DESIGNS GENERIEREN
// ═══════════════════════════════════════════════════════════════════

console.log('🎨 Generating wallpapers...\n');

for (const [key, config] of Object.entries(DESIGNS)) {
  const filename = `wallpaper-${key}.png`;
  const stats = generateWallpaper(config, filename);
  console.log(`✅ ${config.name} (${filename})`);
  console.log(`   Day ${stats.dayOfYear}/${stats.daysInYear} - ${stats.percentage}% complete\n`);
}

console.log('🎉 All wallpapers generated successfully!');