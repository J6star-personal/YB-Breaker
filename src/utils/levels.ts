import { BrickType, LevelData } from '../types';

export const GRID_COLS = 25;
export const GRID_ROWS = 24;

// Helper to create empty grid
function createEmptyGrid(cols: number = GRID_COLS, rows: number = GRID_ROWS): (BrickType | null)[][] {
  return Array.from({ length: rows }, () => Array(cols).fill(null));
}

// Level 1: Faithful reproduction of the user's uploaded reference image
function generateLevel1(): LevelData {
  const grid = createEmptyGrid();
  const centerX = Math.floor(GRID_COLS / 2); // 12

  // The reference image shows:
  // Top rows 0..12: Massive dense red block dome/rectangle
  // Rows 9..15: Green border tracing the bottom contour of the red
  // Rows 12..17: Gray unbreakable stones below the green, forming a curved cradle with a center opening

  for (let r = 0; r < 18; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      // Determine distance from center
      const dx = Math.abs(c - centerX);
      
      // Top rectangular/dome part
      if (r < 8) {
        if (c >= 2 && c <= GRID_COLS - 3) {
          grid[r][c] = 'red';
        }
      } else if (r >= 8 && r <= 12) {
        // Red inner dome
        if (dx <= 8 - (r - 8) * 1.2) {
          grid[r][c] = 'red';
        } else if (dx <= 10) {
          // Green border framing sides and bottom
          grid[r][c] = 'green';
        }
      } else if (r >= 13 && r <= 15) {
        // Bottom green layer curve
        if (dx <= 6 - (r - 13) * 1.5 && r === 13) {
          grid[r][c] = 'red';
        } else if (dx >= 2 && dx <= 8 - (r - 13)) {
          grid[r][c] = 'green';
        } else if (dx > 8 - (r - 13) && dx <= 10) {
          grid[r][c] = 'gray'; // Stone rim
        }
      } else if (r >= 16 && r <= 17) {
        // Lower gray unbreakable stones curve leaving center gap
        if (dx >= 2 && dx <= 5) {
          grid[r][c] = 'gray';
        }
      }
    }
  }

  // Also add the gray bottom wings as shown in reference
  for (let c = 2; c <= 5; c++) {
    grid[12][c] = 'gray';
    grid[13][c] = 'gray';
  }
  for (let c = GRID_COLS - 6; c <= GRID_COLS - 3; c++) {
    grid[12][c] = 'gray';
    grid[13][c] = 'gray';
  }
  for (let c = 5; c <= 8; c++) {
    grid[14][c] = 'gray';
  }
  for (let c = GRID_COLS - 9; c <= GRID_COLS - 6; c++) {
    grid[14][c] = 'gray';
  }
  for (let c = 7; c <= 10; c++) {
    grid[15][c] = 'gray';
  }
  for (let c = GRID_COLS - 11; c <= GRID_COLS - 8; c++) {
    grid[15][c] = 'gray';
  }
  for (let c = 9; c <= 15; c++) {
    grid[16][c] = 'gray';
  }

  return {
    levelNumber: 1,
    title: 'گنبد سرخ (Red Dome)',
    description: 'مرحله اول با الهام از نسخه کلاسیک، مراقب سنگ‌های خاکستری نشکن باشید!',
    cols: GRID_COLS,
    rows: GRID_ROWS,
    grid,
  };
}

// Titles and archetypes for all 100 levels
const LEVEL_ARCHETYPES = [
  'dome', 'pyramid', 'citadel', 'alien', 'heart', 'diamond', 'labyrinth',
  'fortress', 'pillars', 'funnel', 'checker', 'vortex', 'cross', 'hourglass',
  'castle', 'shield', 'ring', 'waves', 'canyon', 'matrix'
];

const PERSIAN_TITLES = [
  'گنبد سرخ', 'هرم طلایی', 'قلعه سنگی', 'مهاجم فضایی', 'قلب سرخ',
  'الماس درخشان', 'مارپیچ خاکستری', 'دژ تسخیرناپذیر', 'ستون‌های باستانی', 'قیف بی‌پایان',
  'شطرنج مرگبار', 'گرداب انرژی', 'صلیب آتشین', 'ساعت شنی', 'برج دیده‌بانی',
  'سپر محافظ', 'حلقه جادویی', 'امواج سهمگین', 'دره باریک', 'ماتریکس نهایی',
  'تندیس پیروزی', 'شوالیه‌های تاریکی', 'دروازه اژدها', 'معبد گمشده', 'طوفان سرخ',
  'دیوار پولادین', 'تله عنکبوت', 'ستاره قطبی', 'هزارتو رازآلود', 'آتشفشان فعال',
  'سنگر پنهان', 'تاج پادشاهی', 'تیغه برنده', 'کمانگیر افسانه‌ای', 'زندان ابدی',
  'چشمه حیات', 'کریستال جادویی', 'سایه مرگ', 'نبرد بی‌پایان', 'قلعه عقاب‌ها',
  'باروی کهن', 'سفینه مادر', 'قفل رمزی', 'پل معلق', 'حصار آتشین',
  'دایره زرد', 'سنگ‌های سرگردان', 'خندق عمیق', 'تیرک دوقلو', 'ستون پنجم',
  'حلقه آتش', 'پایگاه مداری', 'شکارچی زمان', 'دروازه جهنم', 'قوس قزح',
  'طلسم باستانی', 'برج کج', 'گردباد وحشی', 'سرزمین یخبندان', 'خواب خرگوشی',
  'سپر هخامنشی', 'دژ الموت', 'شبیخون شبانه', 'تیرباران', 'میدان سرخ',
  'چهارستون', 'آشیانه کرکس', 'سنگ‌شکن اعظم', 'صخره سیاه', 'موج ضربه‌ای',
  'طلوع خورشید', 'غروب سرخ', 'سایه شوم', 'قصر شناور', 'دالان وحشت',
  'کابوس تاریک', 'خط مقدم', 'تک‌تیرانداز', 'گذرگاه باریک', 'دایره قدرت',
  'سنگر سیمانی', 'شعله جاویدان', 'کوه صخره‌ای', 'هرم قدرت', 'نگهبان دروازه',
  'رزمایش نهایی', 'مشت پولادین', 'سپر المپیک', 'توفان الکتریکی', 'شکاف زمان',
  'شتاب‌دهنده ذرات', 'دژ سپید', 'تپه سرخ', 'صخره عقاب', 'نبرد کهکشانی',
  'ستون‌های هرکول', 'هفت‌خوان رستم', 'تسخیرناپذیر', 'پایان تاریکی', 'استاد اعظم YB'
];

export function getLevel(levelNumber: number): LevelData {
  if (levelNumber <= 1) {
    return generateLevel1();
  }

  const clampedLevel = Math.max(1, Math.min(100, levelNumber));
  const archetypeIndex = (clampedLevel - 1) % LEVEL_ARCHETYPES.length;
  const archetype = LEVEL_ARCHETYPES[archetypeIndex];
  const grid = createEmptyGrid();
  const centerX = Math.floor(GRID_COLS / 2);
  const title = PERSIAN_TITLES[clampedLevel - 1] || `مرحله ${clampedLevel}`;

  // Difficulty scales: higher levels have more gray stones, tighter spaces, and multi-hp blocks
  const diffFactor = (clampedLevel - 1) / 99; // 0.0 to 1.0

  switch (archetype) {
    case 'pyramid': {
      // Inverted pyramid or classic pyramid
      const inverted = clampedLevel % 2 === 0;
      for (let r = 2; r < 18; r++) {
        const span = inverted ? (18 - r) : (r - 1);
        for (let c = centerX - span; c <= centerX + span; c++) {
          if (c >= 0 && c < GRID_COLS) {
            if (c === centerX - span || c === centerX + span) {
              grid[r][c] = (r % 3 === 0 && diffFactor > 0.15) ? 'gray' : 'green';
            } else if ((r + c) % 5 === 0) {
              grid[r][c] = 'multi';
            } else {
              grid[r][c] = (r < 10) ? 'red' : 'green';
            }
          }
        }
      }
      break;
    }

    case 'citadel': {
      // Fortified walls with gray stone pillars and inner core
      for (let r = 2; r < 18; r++) {
        for (let c = 2; c < GRID_COLS - 2; c++) {
          const isBorder = (r === 2 || r === 17 || c === 2 || c === GRID_COLS - 3);
          const isPillar = (c === 7 || c === GRID_COLS - 8) && (r % 2 === 0);
          
          if (isBorder && (c % 3 === 0)) {
            grid[r][c] = 'gray'; // Stone wall with openings
          } else if (isPillar) {
            grid[r][c] = 'gray';
          } else if (r >= 5 && r <= 14 && c >= 8 && c <= GRID_COLS - 9) {
            grid[r][c] = (r % 2 === 0) ? 'red' : 'green';
            if ((r * c) % 7 === 0) grid[r][c] = 'multi';
          } else if (Math.random() < 0.6) {
            grid[r][c] = 'red';
          }
        }
      }
      break;
    }

    case 'alien': {
      // Space invader pixel pattern
      const invaderMap = [
        "  #     #  ",
        "   #   #   ",
        "  #######  ",
        " ## ### ## ",
        "###########",
        "# ####### #",
        "# #     # #",
        "   ## ##   ",
      ];
      const startR = 4;
      const startC = Math.floor((GRID_COLS - 22) / 2);
      for (let r = 0; r < invaderMap.length; r++) {
        const rowStr = invaderMap[r];
        for (let c = 0; c < rowStr.length; c++) {
          if (rowStr[c] === '#') {
            // Duplicate 2x scale horizontally
            const c1 = startC + c * 2;
            const c2 = c1 + 1;
            grid[startR + r * 2][c1] = r < 3 ? 'red' : 'green';
            grid[startR + r * 2][c2] = r < 3 ? 'red' : 'green';
            grid[startR + r * 2 + 1][c1] = r < 3 ? 'red' : 'green';
            grid[startR + r * 2 + 1][c2] = r < 3 ? 'red' : 'green';
          }
        }
      }
      // Gray shields below
      for (let c = 3; c < GRID_COLS - 3; c += 5) {
        grid[18][c] = 'gray';
        grid[18][c + 1] = 'gray';
      }
      break;
    }

    case 'heart': {
      // Heart shape
      for (let r = 2; r < 18; r++) {
        for (let c = 2; c < GRID_COLS - 2; c++) {
          const x = (c - centerX) / 8;
          const y = (10 - r) / 6;
          // Heart implicit equation: (x^2 + y^2 - 1)^3 - x^2 * y^3 <= 0
          const heartFormula = Math.pow(x * x + y * y - 1, 3) - x * x * Math.pow(y, 3);
          if (heartFormula <= 0.05) {
            if (heartFormula > -0.15) {
              grid[r][c] = (clampedLevel > 30 && r % 4 === 0) ? 'gray' : 'green';
            } else {
              grid[r][c] = (r % 3 === 0) ? 'multi' : 'red';
            }
          }
        }
      }
      break;
    }

    case 'diamond': {
      // Concentric diamonds
      for (let r = 2; r < 19; r++) {
        for (let c = 2; c < GRID_COLS - 2; c++) {
          const manhattan = Math.abs(c - centerX) + Math.abs(r - 10);
          if (manhattan <= 10) {
            if (manhattan === 10 || manhattan === 9) {
              grid[r][c] = (manhattan === 10 && clampedLevel > 20) ? 'gray' : 'green';
            } else if (manhattan === 6 || manhattan === 5) {
              grid[r][c] = 'green';
            } else if (manhattan <= 2) {
              grid[r][c] = 'multi';
            } else {
              grid[r][c] = 'red';
            }
          }
        }
      }
      break;
    }

    case 'labyrinth': {
      // Maze corridors of gray stones and destructible blocks
      for (let r = 2; r < 18; r++) {
        for (let c = 2; c < GRID_COLS - 2; c++) {
          if (r % 4 === 0) {
            // Horizontal barrier with alternating gaps
            const gapCol = (r % 8 === 0) ? 4 : GRID_COLS - 5;
            if (Math.abs(c - gapCol) > 2) {
              grid[r][c] = 'gray';
            } else {
              grid[r][c] = 'multi';
            }
          } else {
            grid[r][c] = (c % 2 === 0) ? 'red' : 'green';
          }
        }
      }
      break;
    }

    case 'pillars': {
      // Vertical stone pillars separating chambers of red & green blocks
      for (let r = 2; r < 18; r++) {
        for (let c = 2; c < GRID_COLS - 2; c++) {
          if (c % 5 === 0) {
            grid[r][c] = (r > 4 && r < 16 && r % 3 !== 0) ? 'gray' : 'green';
          } else {
            grid[r][c] = (r < 9) ? 'red' : 'green';
            if ((r + c) % 8 === 0) grid[r][c] = 'multi';
          }
        }
      }
      break;
    }

    case 'vortex':
    case 'ring': {
      // Concentric circles with stone wedges
      for (let r = 2; r < 19; r++) {
        for (let c = 2; c < GRID_COLS - 2; c++) {
          const dist = Math.hypot((c - centerX) * 1.0, (r - 10) * 1.2);
          if (dist >= 2 && dist <= 11) {
            if (dist > 9.5) {
              grid[r][c] = (c % 4 === 0 && diffFactor > 0.2) ? 'gray' : 'green';
            } else if (dist > 6 && dist < 8) {
              grid[r][c] = 'green';
            } else if (dist <= 3.5) {
              grid[r][c] = 'multi';
            } else {
              grid[r][c] = 'red';
            }
          }
        }
      }
      break;
    }

    case 'canyon': {
      // Deep canyon with stone sides and dense red/green center
      for (let r = 2; r < 18; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          if (c <= 4 || c >= GRID_COLS - 5) {
            grid[r][c] = (r % 2 === 0) ? 'gray' : 'green';
          } else if (c >= 6 && c <= GRID_COLS - 7) {
            grid[r][c] = (r % 3 === 0) ? 'red' : 'green';
            if (r === 10 && c === centerX) grid[r][c] = 'life';
            if (r % 5 === 0) grid[r][c] = 'multi';
          }
        }
      }
      break;
    }

    default: {
      // Procedural checkerboard / layered fortress based on level seed
      for (let r = 2; r < 17; r++) {
        for (let c = 2; c < GRID_COLS - 2; c++) {
          const hash = Math.sin(clampedLevel * 13 + r * 7 + c * 3) * 10000;
          const val = hash - Math.floor(hash);

          if (val < 0.12 && diffFactor > 0.1) {
            // Gray unbreakable stone
            grid[r][c] = 'gray';
          } else if (val < 0.22) {
            // Power multi-ball block
            grid[r][c] = 'multi';
          } else if (val < 0.6) {
            grid[r][c] = 'red';
          } else if (val < 0.88) {
            grid[r][c] = 'green';
          }
        }
      }
      break;
    }
  }

  // Ensure every level has at least 15 breakable blocks and is solvable
  let breakableCount = 0;
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      if (grid[r][c] && grid[r][c] !== 'gray') {
        breakableCount++;
      }
    }
  }

  // If for any reason count is low, add a center reserve
  if (breakableCount < 20) {
    for (let r = 4; r < 8; r++) {
      for (let c = 5; c < GRID_COLS - 5; c++) {
        if (!grid[r][c] || grid[r][c] === 'gray') {
          grid[r][c] = 'red';
        }
      }
    }
  }

  return {
    levelNumber: clampedLevel,
    title,
    description: `مرحله ${clampedLevel} از ۱۰۰ - سختی: ${Math.round(diffFactor * 100)}%`,
    cols: GRID_COLS,
    rows: GRID_ROWS,
    grid,
  };
}
