import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Ball, Brick, Paddle, PowerUp, Particle, Laser, LevelData, BrickType } from '../types';
import { soundManager } from '../utils/audio';

interface GameCanvasProps {
  levelData: LevelData;
  speedMultiplier: number;
  isPaused: boolean;
  onScoreUpdate: (delta: number) => void;
  onLivesUpdate: (lives: number) => void;
  onLevelComplete: () => void;
  onGameOver: () => void;
  currentLives: number;
}

const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 720;
const PADDLE_DEFAULT_WIDTH = 84;
const PADDLE_HEIGHT = 14;
const BALL_RADIUS = 4;
const BASE_BALL_SPEED = 5.2;

export const GameCanvas: React.FC<GameCanvasProps> = ({
  levelData,
  speedMultiplier,
  isPaused,
  onScoreUpdate,
  onLivesUpdate,
  onLevelComplete,
  onGameOver,
  currentLives,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Mutable Game State in refs for high-performance 60fps rendering without React re-render lag
  const bricksRef = useRef<Brick[]>([]);
  const ballsRef = useRef<Ball[]>([]);
  const paddleRef = useRef<Paddle>({
    x: CANVAS_WIDTH / 2 - PADDLE_DEFAULT_WIDTH / 2,
    y: CANVAS_HEIGHT - 65,
    width: PADDLE_DEFAULT_WIDTH,
    height: PADDLE_HEIGHT,
    targetX: CANVAS_WIDTH / 2 - PADDLE_DEFAULT_WIDTH / 2,
    speed: 0.35,
  });
  const powerUpsRef = useRef<PowerUp[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const lasersRef = useRef<Laser[]>([]);

  // Buff timers & states
  const paddleExpandedTimerRef = useRef<number>(0);
  const laserTimerRef = useRef<number>(0);
  const comboCountRef = useRef<number>(0);
  const comboTimerRef = useRef<number>(0);
  const livesRef = useRef<number>(currentLives);
  livesRef.current = currentLives;

  const [activeBallCount, setActiveBallCount] = useState<number>(1);
  const [remainingBricksCount, setRemainingBricksCount] = useState<number>(0);
  const [isReadyToLaunch, setIsReadyToLaunch] = useState<boolean>(true);

  // Initialize Bricks from LevelData
  const initLevelBricks = useCallback(() => {
    const { cols, rows, grid } = levelData;
    const paddingX = 16;
    const paddingY = 45;
    const availableWidth = CANVAS_WIDTH - paddingX * 2;
    const blockGap = 1.5;
    const blockWidth = (availableWidth - (cols - 1) * blockGap) / cols;
    const blockHeight = 11;

    const newBricks: Brick[] = [];
    let idCounter = 0;
    let breakable = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const type = grid[r]?.[c];
        if (!type) continue;

        const x = paddingX + c * (blockWidth + blockGap);
        const y = paddingY + r * (blockHeight + blockGap);

        let color = '#e52521';
        let hp = 1;
        if (type === 'gray') {
          color = '#737985';
          hp = -1; // Unbreakable
        } else if (type === 'green') {
          color = '#00d632';
          hp = 1;
          breakable++;
        } else if (type === 'multi') {
          color = '#ffb703'; // Amber
          hp = 1;
          breakable++;
        } else if (type === 'life') {
          color = '#ec4899'; // Pink
          hp = 1;
          breakable++;
        } else {
          // 'red'
          color = '#e52521';
          hp = 1;
          breakable++;
        }

        newBricks.push({
          id: ++idCounter,
          row: r,
          col: c,
          x,
          y,
          width: blockWidth,
          height: blockHeight,
          type,
          hp,
          maxHp: hp,
          color,
        });
      }
    }

    bricksRef.current = newBricks;
    setRemainingBricksCount(breakable);
  }, [levelData]);

  // Reset ball on paddle
  const resetBallOnPaddle = useCallback(() => {
    const paddle = paddleRef.current;
    ballsRef.current = [
      {
        id: 1,
        x: paddle.x + paddle.width / 2,
        y: paddle.y - BALL_RADIUS - 1,
        vx: 0,
        vy: 0,
        radius: BALL_RADIUS,
        stuckToPaddle: true,
        stuckOffset: paddle.width / 2,
      },
    ];
    setIsReadyToLaunch(true);
    setActiveBallCount(1);
  }, []);

  // Launch stuck balls
  const launchBall = useCallback(() => {
    let launchedAny = false;
    const balls = ballsRef.current;
    for (const ball of balls) {
      if (ball.stuckToPaddle) {
        ball.stuckToPaddle = false;
        // Launch upwards with a slight randomized angle
        const angle = -Math.PI / 2 + (Math.random() * 0.4 - 0.2);
        const speed = BASE_BALL_SPEED * speedMultiplier;
        ball.vx = Math.cos(angle) * speed;
        ball.vy = Math.sin(angle) * speed;
        launchedAny = true;
      }
    }
    if (launchedAny) {
      setIsReadyToLaunch(false);
      soundManager.playPaddleHit();
    }
  }, [speedMultiplier]);

  // Spawn extra balls (Many Bricks signature mechanic!)
  const spawnExtraBalls = useCallback((count: number, sourceX?: number, sourceY?: number) => {
    const balls = ballsRef.current;
    if (balls.length >= 150) return; // Safeguard performance limit

    const refBall = balls[0] || {
      x: paddleRef.current.x + paddleRef.current.width / 2,
      y: paddleRef.current.y - 10,
      vx: 0,
      vy: -BASE_BALL_SPEED * speedMultiplier,
    };

    const originX = sourceX ?? refBall.x;
    const originY = sourceY ?? refBall.y;
    const speed = BASE_BALL_SPEED * speedMultiplier;

    soundManager.playSpawnBall();

    for (let i = 0; i < count; i++) {
      if (balls.length >= 150) break;
      // Spread in various upward / radial angles
      const angle = -Math.PI * 0.15 - Math.random() * Math.PI * 0.7;
      balls.push({
        id: Date.now() + Math.random(),
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: BALL_RADIUS,
        stuckToPaddle: false,
        stuckOffset: 0,
      });
    }
    setActiveBallCount(balls.length);
  }, [speedMultiplier]);

  // Spawn visual particle shards on block hit
  const spawnParticles = (x: number, y: number, color: string, count: number = 6) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3.5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 2.5,
        color,
        alpha: 1,
        life: 0,
        maxLife: 20 + Math.random() * 15,
      });
    }
  };

  // Setup on level change
  useEffect(() => {
    initLevelBricks();
    resetBallOnPaddle();
    powerUpsRef.current = [];
    particlesRef.current = [];
    lasersRef.current = [];
    paddleExpandedTimerRef.current = 0;
    laserTimerRef.current = 0;
    paddleRef.current.width = PADDLE_DEFAULT_WIDTH;
  }, [levelData, initLevelBricks, resetBallOnPaddle]);

  // Keyboard controls (Arrow keys, Spacebar, A / D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (isReadyToLaunch) {
          launchBall();
        } else if (laserTimerRef.current > 0) {
          // Fire laser
          fireLaser();
        }
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        paddleRef.current.targetX = Math.max(8, paddleRef.current.targetX - 35);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        paddleRef.current.targetX = Math.min(
          CANVAS_WIDTH - paddleRef.current.width - 8,
          paddleRef.current.targetX + 35
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, isReadyToLaunch, launchBall]);

  // Laser firing logic
  const fireLaser = () => {
    const paddle = paddleRef.current;
    lasersRef.current.push(
      { x: paddle.x + 8, y: paddle.y - 4, vy: -9 },
      { x: paddle.x + paddle.width - 8, y: paddle.y - 4, vy: -9 }
    );
    soundManager.playLaser();
  };

  // Convert mouse/touch coordinates to internal 480x720 canvas coordinate system
  const updatePaddleTargetX = useCallback((clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const relativeX = (clientX - rect.left) * scaleX;
    const paddle = paddleRef.current;
    const clamped = Math.max(4, Math.min(CANVAS_WIDTH - paddle.width - 4, relativeX - paddle.width / 2));
    paddle.targetX = clamped;
  }, []);

  // Mouse Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPaused) return;
    updatePaddleTargetX(e.clientX);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPaused) return;
    if (isReadyToLaunch) {
      launchBall();
    } else if (laserTimerRef.current > 0) {
      fireLaser();
    }
  };

  // Touch Handlers with smooth dragging and immediate responsive tracking
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isPaused) return;
    if (e.touches.length > 0) {
      updatePaddleTargetX(e.touches[0].clientX);
      if (isReadyToLaunch) {
        launchBall();
      } else if (laserTimerRef.current > 0) {
        fireLaser();
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isPaused) return;
    if (e.touches.length > 0) {
      updatePaddleTargetX(e.touches[0].clientX);
    }
  };

  // MAIN GAME LOOP (requestAnimationFrame)
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const loop = (time: number) => {
      animId = requestAnimationFrame(loop);

      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      if (isPaused) {
        // Draw paused screen overlay
        renderGame(ctx, true);
        return;
      }

      // Update state
      updateGamePhysics();
      renderGame(ctx, false);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, speedMultiplier, onScoreUpdate, onLivesUpdate, onLevelComplete, onGameOver, spawnExtraBalls, launchBall]);

  // Physics Simulation
  const updateGamePhysics = () => {
    const paddle = paddleRef.current;
    const balls = ballsRef.current;
    const bricks = bricksRef.current;
    const powerUps = powerUpsRef.current;
    const particles = particlesRef.current;
    const lasers = lasersRef.current;

    // Smooth Paddle Interpolation
    paddle.x += (paddle.targetX - paddle.x) * 0.4;
    paddle.x = Math.max(4, Math.min(CANVAS_WIDTH - paddle.width - 4, paddle.x));

    // Update Timers
    if (paddleExpandedTimerRef.current > 0) {
      paddleExpandedTimerRef.current -= 1;
      if (paddleExpandedTimerRef.current <= 0) {
        paddle.width = PADDLE_DEFAULT_WIDTH;
      }
    }

    if (laserTimerRef.current > 0) {
      laserTimerRef.current -= 1;
    }

    if (comboTimerRef.current > 0) {
      comboTimerRef.current -= 1;
      if (comboTimerRef.current <= 0) {
        comboCountRef.current = 0;
      }
    }

    // Sub-steps for bulletproof high-speed ball physics & no tunneling
    const subSteps = 2;
    for (let step = 0; step < subSteps; step++) {
      const stepScale = 1 / subSteps;

      for (let i = balls.length - 1; i >= 0; i--) {
        const ball = balls[i];

        if (ball.stuckToPaddle) {
          ball.x = paddle.x + ball.stuckOffset;
          ball.y = paddle.y - ball.radius - 1;
          continue;
        }

        // Apply motion
        ball.x += ball.vx * stepScale;
        ball.y += ball.vy * stepScale;

        // Wall collisions
        // Left wall
        if (ball.x - ball.radius <= 4) {
          ball.x = 4 + ball.radius;
          ball.vx = Math.abs(ball.vx);
          soundManager.playPaddleHit();
        }
        // Right wall
        else if (ball.x + ball.radius >= CANVAS_WIDTH - 4) {
          ball.x = CANVAS_WIDTH - 4 - ball.radius;
          ball.vx = -Math.abs(ball.vx);
          soundManager.playPaddleHit();
        }
        // Top wall
        if (ball.y - ball.radius <= 36) {
          ball.y = 36 + ball.radius;
          ball.vy = Math.abs(ball.vy);
          soundManager.playPaddleHit();
        }

        // Paddle Collision
        if (
          ball.vy > 0 &&
          ball.y + ball.radius >= paddle.y &&
          ball.y - ball.radius <= paddle.y + paddle.height &&
          ball.x + ball.radius >= paddle.x &&
          ball.x - ball.radius <= paddle.x + paddle.width
        ) {
          ball.y = paddle.y - ball.radius;
          // Calculate bounce angle based on strike position on paddle
          const hitOffset = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
          const maxBounceAngle = Math.PI * 0.42; // Up to ~75 degrees
          const bounceAngle = hitOffset * maxBounceAngle;

          const currentSpeed = Math.hypot(ball.vx, ball.vy);
          const normalizedSpeed = Math.max(BASE_BALL_SPEED * speedMultiplier, Math.min(currentSpeed, 10));

          ball.vx = Math.sin(bounceAngle) * normalizedSpeed;
          ball.vy = -Math.cos(bounceAngle) * normalizedSpeed;

          // Prevent nearly flat horizontal bounce
          if (Math.abs(ball.vy) < 1.8) {
            ball.vy = -1.8;
          }

          soundManager.playPaddleHit();
          comboCountRef.current = 0; // reset combo on paddle touch
        }

        // Brick Collisions
        for (let bIdx = 0; bIdx < bricks.length; bIdx++) {
          const brick = bricks[bIdx];

          // AABB + circle collision
          const closestX = Math.max(brick.x, Math.min(ball.x, brick.x + brick.width));
          const closestY = Math.max(brick.y, Math.min(ball.y, brick.y + brick.height));
          const distX = ball.x - closestX;
          const distY = ball.y - closestY;
          const distSq = distX * distX + distY * distY;

          if (distSq <= ball.radius * ball.radius) {
            // Collision detected!
            // Determine bounce direction
            const prevX = ball.x - ball.vx * stepScale;
            const prevY = ball.y - ball.vy * stepScale;

            if (prevX < brick.x || prevX > brick.x + brick.width) {
              ball.vx = -ball.vx;
            } else {
              ball.vy = -ball.vy;
            }

            // Handle brick damage
            if (brick.type === 'gray') {
              // Unbreakable stone
              soundManager.playGrayHit();
              spawnParticles(closestX, closestY, '#a0aec0', 3);
            } else {
              // Destructible block
              comboCountRef.current++;
              comboTimerRef.current = 80;
              soundManager.playBrickHit(comboCountRef.current);
              spawnParticles(closestX, closestY, brick.color, 7);

              onScoreUpdate(10 + comboCountRef.current * 2);

              // Powerups / Multi-ball trigger
              if (brick.type === 'multi') {
                // Instantly spawn extra balls into flight! (Signature Many Bricks thrill)
                spawnExtraBalls(3, brick.x + brick.width / 2, brick.y + brick.height / 2);
              } else if (brick.type === 'life') {
                // Drop falling heart
                powerUps.push({
                  id: Date.now() + Math.random(),
                  x: brick.x + brick.width / 2,
                  y: brick.y + brick.height / 2,
                  vy: 2.2,
                  type: 'life',
                  text: '♥',
                  color: '#ec4899',
                  radius: 8,
                });
              } else {
                // Standard destructible brick: 20% chance to drop powerup or split
                const rand = Math.random();
                if (rand < 0.08) {
                  // Extra balls capsule
                  powerUps.push({
                    id: Date.now() + Math.random(),
                    x: brick.x + brick.width / 2,
                    y: brick.y + brick.height / 2,
                    vy: 2.3,
                    type: 'extra_balls',
                    text: '+3',
                    color: '#ffb703',
                    radius: 8,
                  });
                } else if (rand < 0.14) {
                  // Laser powerup
                  powerUps.push({
                    id: Date.now() + Math.random(),
                    x: brick.x + brick.width / 2,
                    y: brick.y + brick.height / 2,
                    vy: 2.2,
                    type: 'laser',
                    text: '⚡',
                    color: '#06b6d4',
                    radius: 8,
                  });
                } else if (rand < 0.20) {
                  // Expand paddle
                  powerUps.push({
                    id: Date.now() + Math.random(),
                    x: brick.x + brick.width / 2,
                    y: brick.y + brick.height / 2,
                    vy: 2.2,
                    type: 'expand',
                    text: '↔',
                    color: '#10b981',
                    radius: 8,
                  });
                }
              }

              // Remove destroyed brick
              bricks.splice(bIdx, 1);

              // Check if any breakable bricks remain
              const breakables = bricks.filter((b) => b.type !== 'gray').length;
              setRemainingBricksCount(breakables);

              if (breakables === 0) {
                // Victory!
                soundManager.playLevelWin();
                onLevelComplete();
                return;
              }
            }
            break;
          }
        }

        // Ball fell out of screen bottom
        if (ball.y - ball.radius > CANVAS_HEIGHT) {
          balls.splice(i, 1);
        }
      }
    }

    setActiveBallCount(balls.length);

    // If all balls are lost
    if (balls.length === 0) {
      const remainingLives = livesRef.current - 1;
      onLivesUpdate(remainingLives);

      if (remainingLives <= 0) {
        soundManager.playGameOver();
        onGameOver();
      } else {
        soundManager.playGameOver();
        resetBallOnPaddle();
      }
    }

    // Laser updates
    for (let i = lasers.length - 1; i >= 0; i--) {
      const laser = lasers[i];
      laser.y += laser.vy;

      // Hit brick?
      let hit = false;
      for (let bIdx = 0; bIdx < bricks.length; bIdx++) {
        const brick = bricks[bIdx];
        if (
          laser.x >= brick.x &&
          laser.x <= brick.x + brick.width &&
          laser.y >= brick.y &&
          laser.y <= brick.y + brick.height
        ) {
          hit = true;
          if (brick.type !== 'gray') {
            soundManager.playBrickHit();
            spawnParticles(laser.x, laser.y, brick.color, 4);
            onScoreUpdate(10);
            bricks.splice(bIdx, 1);
            const breakables = bricks.filter((b) => b.type !== 'gray').length;
            setRemainingBricksCount(breakables);
            if (breakables === 0) {
              soundManager.playLevelWin();
              onLevelComplete();
              return;
            }
          } else {
            soundManager.playGrayHit();
          }
          break;
        }
      }

      if (hit || laser.y < 30) {
        lasers.splice(i, 1);
      }
    }

    // PowerUp updates
    for (let i = powerUps.length - 1; i >= 0; i--) {
      const p = powerUps[i];
      p.y += p.vy;

      // Catch by paddle
      if (
        p.y + p.radius >= paddle.y &&
        p.y - p.radius <= paddle.y + paddle.height &&
        p.x >= paddle.x &&
        p.x <= paddle.x + paddle.width
      ) {
        soundManager.playPowerupCatch();
        onScoreUpdate(50);

        if (p.type === 'extra_balls') {
          spawnExtraBalls(6, paddle.x + paddle.width / 2, paddle.y - 10);
        } else if (p.type === 'laser') {
          laserTimerRef.current = 600; // ~10 seconds of laser
        } else if (p.type === 'expand') {
          paddle.width = PADDLE_DEFAULT_WIDTH * 1.45;
          paddleExpandedTimerRef.current = 600;
        } else if (p.type === 'life') {
          onLivesUpdate(Math.min(5, livesRef.current + 1));
        }

        powerUps.splice(i, 1);
        continue;
      }

      // Fell off screen
      if (p.y > CANVAS_HEIGHT) {
        powerUps.splice(i, 1);
      }
    }

    // Particle updates
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      p.alpha = 1 - p.life / p.maxLife;
      if (p.life >= p.maxLife) {
        particles.splice(i, 1);
      }
    }
  };

  // Canvas Rendering
  const renderGame = (ctx: CanvasRenderingContext2D, paused: boolean) => {
    // Background: Deep Navy Blue from user image
    ctx.fillStyle = '#101546';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Subtle arena borders
    ctx.strokeStyle = '#1e2870';
    ctx.lineWidth = 3;
    ctx.strokeRect(3, 35, CANVAS_WIDTH - 6, CANVAS_HEIGHT - 38);

    // Draw Bricks
    const bricks = bricksRef.current;
    for (const brick of bricks) {
      ctx.fillStyle = brick.color;
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);

      // Subtle pixel brick bevel / shading to match the clean grid in the screenshot
      if (brick.type === 'gray') {
        // Metallic stone highlight
        ctx.fillStyle = '#8f98a7';
        ctx.fillRect(brick.x, brick.y, brick.width, 1);
        ctx.fillRect(brick.x, brick.y, 1, brick.height);
        ctx.fillStyle = '#4c525d';
        ctx.fillRect(brick.x, brick.y + brick.height - 1, brick.width, 1);
        ctx.fillRect(brick.x + brick.width - 1, brick.y, 1, brick.height);
      } else if (brick.type === 'multi') {
        // Golden pulsing center dot
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(brick.x + brick.width / 2 - 1, brick.y + brick.height / 2 - 1, 2, 2);
      }
    }

    // Draw Lasers
    const lasers = lasersRef.current;
    ctx.fillStyle = '#38bdf8';
    for (const laser of lasers) {
      ctx.fillRect(laser.x - 1.5, laser.y, 3, 10);
    }

    // Draw PowerUps
    const powerUps = powerUpsRef.current;
    for (const p of powerUps) {
      ctx.save();
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // PowerUp Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.text, p.x, p.y);
      ctx.restore();
    }

    // Draw Particles
    const particles = particlesRef.current;
    for (const p of particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      ctx.restore();
    }

    // Draw Paddle (Crisp White Bar as seen in screenshot)
    const paddle = paddleRef.current;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    // If Laser Active, draw laser cannons on paddle sides
    if (laserTimerRef.current > 0) {
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(paddle.x + 4, paddle.y - 4, 5, 4);
      ctx.fillRect(paddle.x + paddle.width - 9, paddle.y - 4, 5, 4);
    }

    // Draw Balls (Small Crisp White Dots)
    const balls = ballsRef.current;
    ctx.fillStyle = '#ffffff';
    for (const ball of balls) {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Aiming Guide if ball is ready to launch
    if (isReadyToLaunch && balls.length > 0) {
      const ball = balls[0];
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(ball.x, ball.y);
      ctx.lineTo(ball.x, ball.y - 60);
      ctx.stroke();
      ctx.restore();

      // Pulsing "برای پرتاب لمس یا کلیک کنید" hint
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = '12px Vazirmatn, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('برای پرتاب ضربه بزنید / کلیک کنید (یا Space)', CANVAS_WIDTH / 2, paddle.y + 35);
    }

    // Draw HUD Top bar inside Canvas
    ctx.fillStyle = 'rgba(16, 21, 70, 0.95)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, 34);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px Vazirmatn, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`باقیمانده: ${remainingBricksCount}`, CANVAS_WIDTH - 12, 22);

    ctx.textAlign = 'left';
    ctx.fillText(`توپ‌ها: ${balls.length}`, 12, 22);

    if (comboCountRef.current > 2) {
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`COMBO x${comboCountRef.current}`, CANVAS_WIDTH / 2, 22);
    }

    // Paused Overlay
    if (paused) {
      ctx.fillStyle = 'rgba(10, 14, 43, 0.75)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px Vazirmatn, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('بازی متوقف شده', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10);

      ctx.font = '13px Vazirmatn, sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('برای ادامه دکمه مکث را بزنید', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 25);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center w-full max-w-[480px] mx-auto select-none touch-none"
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className="w-full h-auto aspect-[480/720] rounded-lg shadow-2xl border-2 border-[#1e296e] bg-[#101546] cursor-crosshair active:cursor-grabbing block"
      />
    </div>
  );
};
