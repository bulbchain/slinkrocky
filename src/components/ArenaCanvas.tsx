import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';

import { sounds } from '../audio';

import {
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Share2,
  Zap,
  Shield,
  Magnet,
  Trophy,
  Flame,
  Sparkles,
} from 'lucide-react';

interface ArenaCanvasProps {
  callsign: string;
  wormColor?: string;
  onKillsUpdate?: (kills: number) => void;
  onScoreUpdate?: (score: number) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

type PowerUpType = 'magnet' | 'phase' | 'overclock';

interface PowerUp {
  x: number;
  y: number;
  type: PowerUpType;
  radius: number;
  pulse: number;
}

interface ActivePowerUp {
  type: PowerUpType;
  duration: number; // in frames (60 = 1 sec)
  maxDuration: number;
}

interface Orb {
  x: number;
  y: number;
  radius: number;
  color: string;
  pulse: number;
  vx: number;
  vy: number;
  value: number;
  isLoot?: boolean;
  type?: 'standard' | 'super' | 'star';
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  color: string;
  size: number;
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  decay: number;
  scale?: number;
}

interface TrailPoint {
  x: number;
  y: number;
}

interface BotCraft {
  name: string;
  color: string;
  coreColor: string;
  eyeColor: string;
  x: number;
  y: number;
  angle: number;
  speed: number;
  trail: TrailPoint[];
  maxTrail: number;
  thickness: number;
  turnRate: number;
  score: number;
  skinName: string;
  isFastPasser?: boolean;
}

const ORB_PALETTE = [
  '#00f5d4', // Neon Cyan
  '#ff007f', // Hot Magenta
  '#00ff88', // Hyper Lime
  '#ffaa00', // Radiant Gold
  '#a855f7', // Electric Violet
  '#38bdf8', // Ice Blue
  '#ffffff', // Pure Star
];

export const ArenaCanvas: React.FC<ArenaCanvasProps> = ({
  callsign,
  wormColor = '#00f5d4',
  onKillsUpdate,
  onScoreUpdate,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const restartRef = useRef<() => void>(() => {});
  const isPausedRef = useRef(true);

  const [shareAvailable, setShareAvailable] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [showDeathModal, setShowDeathModal] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const playGame = () => {
    sounds.playBeep(700);
    isPausedRef.current = false;
    setIsPaused(false);
  };

  const WEBSITE_URL = 'https://play-slink.io';
  const TWITTER_URL = 'https://x.com/play_slink';

  const shareOnX = useCallback(() => {
    if (lastScore == null) return;
    const text = `I scored ${lastScore.toLocaleString()} points as ${callsign || 'SLINK_VIPER'} in SLINK Arena! 🐍 Feed on light and dominate the grid: ${WEBSITE_URL} via ${TWITTER_URL}`;
    const intent = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text);
    window.open(intent, '_blank', 'noopener');
  }, [lastScore, callsign]);

  const shareThenRestart = useCallback(() => {
    shareOnX();
    setShowDeathModal(false);
    try {
      restartRef.current();
    } catch {}
  }, [shareOnX]);

  const playAgain = useCallback(() => {
    setShowDeathModal(false);
    try {
      restartRef.current();
    } catch {}
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mobileInputRef = useRef({
    active: false,
    dx: 0,
    dy: -1,
    boost: false,
  });

  // HUD & Game State
  const [score, setScore] = useState<number>(0);
  const [kills, setKills] = useState<number>(0);
  const [bestToday, setBestToday] = useState<number>(6420);
  const [comboCount, setComboCount] = useState<number>(0);
  const [activeBuffs, setActiveBuffs] = useState<{ type: PowerUpType; percent: number }[]>([]);

  const [alertText, setAlertText] = useState<string>('ARENA LIVE');
  const [alertColor, setAlertColor] = useState<string>('#00f5d4');
  const [hintVisible, setHintVisible] = useState<boolean>(true);

  const [roster, setRoster] = useState<{ name: string; score: number; isPlayer?: boolean; color?: string }[]>([
    { name: 'VIPER_PRIME', score: 8420, color: '#ff007f' },
    { name: 'NEON_HYDRA', score: 6810, color: '#00ff88' },
    { name: 'SOLAR_COIL', score: 5320, color: '#ffaa00' },
    { name: 'VOID_REAPER', score: 4190, color: '#a855f7' },
    { name: 'CYBER_WORM', score: 3250, color: '#38bdf8' },
    { name: callsign || 'SLINK_VIPER', score: 450, isPlayer: true, color: wormColor },
  ]);

  useEffect(() => {
    setRoster((prev) =>
      prev.map((item) =>
        item.isPlayer ? { ...item, name: callsign || 'SLINK_VIPER', color: wormColor } : item
      )
    );
  }, [callsign, wormColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = container.clientWidth || 800;
    let height = container.clientHeight || 500;
    const dpr = window.devicePixelRatio || 1;

    const WORLD_WIDTH = 3400;
    const WORLD_HEIGHT = 3400;
    const ARENA_CENTER_X = WORLD_WIDTH / 2;
    const ARENA_CENTER_Y = WORLD_HEIGHT / 2;
    const ARENA_RADIUS = WORLD_WIDTH / 2 - 50;

    const resize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    const observer = new ResizeObserver(() => resize());
    observer.observe(container);

    const createOrb = (x?: number, y?: number, isLoot = false, lootValue = 50): Orb => {
      let orbX = x;
      let orbY = y;

      if (orbX === undefined || orbY === undefined) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * (ARENA_RADIUS - 70);
        orbX = ARENA_CENTER_X + Math.cos(angle) * r;
        orbY = ARENA_CENTER_Y + Math.sin(angle) * r;
      }

      const isStar = isLoot && Math.random() < 0.35;
      const orbColor = isLoot
        ? isStar ? '#ffffff' : Math.random() < 0.5 ? '#ff007f' : '#ffaa00'
        : ORB_PALETTE[Math.floor(Math.random() * ORB_PALETTE.length)];

      return {
        x: orbX,
        y: orbY,
        radius: isLoot ? (isStar ? 6.5 : 5.0) : Math.random() * 2.2 + 2.5,
        color: orbColor,
        pulse: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * (isLoot ? 3.5 : 0.4),
        vy: (Math.random() - 0.5) * (isLoot ? 3.5 : 0.4),
        value: isLoot ? (isStar ? lootValue * 1.5 : lootValue) : Math.random() > 0.8 ? 60 : 30,
        isLoot,
        type: isStar ? 'star' : isLoot ? 'super' : 'standard',
      };
    };

    let orbs: Orb[] = Array.from({ length: 420 }, () => createOrb());
    let powerUps: PowerUp[] = [];
    let activePowerUps: Map<PowerUpType, ActivePowerUp> = new Map();

    const spawnPowerUp = () => {
      if (powerUps.length >= 6) return;
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * (ARENA_RADIUS - 150);
      const types: PowerUpType[] = ['magnet', 'phase', 'overclock'];
      powerUps.push({
        x: ARENA_CENTER_X + Math.cos(angle) * r,
        y: ARENA_CENTER_Y + Math.sin(angle) * r,
        type: types[Math.floor(Math.random() * types.length)],
        radius: 14,
        pulse: 0,
      });
    };

    for (let i = 0; i < 4; i++) spawnPowerUp();

    let particles: Spark[] = [];
    let floatingTexts: FloatingText[] = [];
    let screenShake = 0;

    const emitSparks = (x: number, y: number, color: string, count = 12, speedMult = 1) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 3.5 + 1.8) * speedMult;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.0,
          decay: Math.random() * 0.035 + 0.02,
          color,
          size: Math.random() * 2.8 + 1.5,
        });
      }
    };

    const addScorePopup = (x: number, y: number, text: string, color = '#00f5d4', scale = 1) => {
      floatingTexts.push({
        x,
        y,
        text,
        color,
        life: 1.0,
        decay: 0.018,
        scale,
      });
    };

    const player = {
      name: callsign || 'SLINK_VIPER',
      x: ARENA_CENTER_X,
      y: ARENA_CENTER_Y,
      angle: -Math.PI / 2,
      baseSpeed: 2.8,
      boostSpeed: 5.2,
      trail: [] as TrailPoint[],
      maxTrail: 36,
      thickness: 9.0,
      color: wormColor,
    };

    const camera = {
      x: player.x - width / 2,
      y: player.y - height / 2,
    };

    for (let i = 0; i < 22; i++) {
      player.trail.push({ x: player.x, y: player.y + i * 3 });
    }

    const botSkins = [
      { name: 'CYBER_DRAGON', color: '#ff007f', coreColor: '#ffffff', eyeColor: '#ffff00', thickness: 9.0, speedMult: 1.05 },
      { name: 'ACID_SERPENT', color: '#00ff88', coreColor: '#e0ffe8', eyeColor: '#003820', thickness: 8.5, speedMult: 1.1 },
      { name: 'SOLAR_FLARE', color: '#ffaa00', coreColor: '#ffffff', eyeColor: '#ff0055', thickness: 9.5, speedMult: 0.95 },
      { name: 'VOID_COIL', color: '#a855f7', coreColor: '#f3e8ff', eyeColor: '#00f5d4', thickness: 9.0, speedMult: 1.0 },
      { name: 'GLACIER_SLINK', color: '#38bdf8', coreColor: '#ffffff', eyeColor: '#ffffff', thickness: 8.5, speedMult: 1.0 },
      { name: 'NEON_VIPER', color: '#00f5d4', coreColor: '#ffffff', eyeColor: '#002820', thickness: 9.0, speedMult: 1.05 },
    ];

    const createSingleBot = (index: number): BotCraft => {
      const skin = botSkins[Math.floor(Math.random() * botSkins.length)];
      const isFastPasser = Math.random() < 0.2;

      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * (ARENA_RADIUS - 120);
      const bx = ARENA_CENTER_X + Math.cos(angle) * r;
      const by = ARENA_CENTER_Y + Math.sin(angle) * r;

      const bTrail: TrailPoint[] = [];
      const trailLen = isFastPasser ? 50 : Math.floor(Math.random() * 20 + 28);
      for (let j = 0; j < 20; j++) {
        bTrail.push({ x: bx - j * 2.5, y: by - j * 2.5 });
      }

      const botNames = [
        'VIPER_X', 'COIL_QUEEN', 'NEON_HYDRA', 'TURBO_FANG',
        'SOLAR_SLINK', 'CYBER_MUD', 'APEX_HUNTER', 'WORM_9',
        'PHANTOM_TAIL', 'VORTEX_DEVOURER', 'HYPER_VIPER'
      ];

      const botName = isFastPasser
        ? `FAST_${botNames[Math.floor(Math.random() * botNames.length)]}`
        : `${botNames[Math.floor(Math.random() * botNames.length)]}_${Math.floor(Math.random() * 89 + 10)}`;

      return {
        name: botName,
        color: isFastPasser ? '#ff0055' : skin.color,
        coreColor: isFastPasser ? '#ffff00' : skin.coreColor,
        eyeColor: isFastPasser ? '#ffffff' : skin.eyeColor,
        x: bx,
        y: by,
        angle: Math.random() * Math.PI * 2,
        speed: (isFastPasser ? 4.8 + Math.random() * 1.4 : (1.9 + Math.random() * 0.7)) * skin.speedMult,
        trail: bTrail,
        maxTrail: trailLen,
        thickness: skin.thickness,
        turnRate: isFastPasser ? 0.018 : (0.045 + Math.random() * 0.015),
        score: isFastPasser ? 850 : Math.floor(Math.random() * 600 + 150),
        skinName: skin.name,
        isFastPasser,
      };
    };

    const createBotPool = (count: number): BotCraft[] => {
      return Array.from({ length: count }, (_, i) => createSingleBot(i));
    };

    let bots: BotCraft[] = createBotPool(24);
    let isBoosting = false;
    const mouse = { x: width / 2, y: height / 2, active: false };
    const mobileInput = mobileInputRef.current;

    let frame = 0;
    let localScore = 0;
    let localKills = 0;

    let comboTimer = 0;
    let currentCombo = 0;

    const dropLootOrbs = (x: number, y: number, totalScore: number) => {
      const numOrbs = Math.min(30, Math.max(10, Math.floor(totalScore / 45)));
      const valuePerOrb = Math.max(30, Math.floor(totalScore / numOrbs));
      for (let i = 0; i < numOrbs; i++) {
        orbs.push(createOrb(x, y, true, valuePerOrb));
      }
    };

    restartRef.current = () => {
      localScore = 0;
      localKills = 0;
      currentCombo = 0;
      comboTimer = 0;
      setComboCount(0);
      activePowerUps.clear();

      player.x = ARENA_CENTER_X;
      player.y = ARENA_CENTER_Y;
      player.angle = -Math.PI / 2;
      player.trail = [];
      player.maxTrail = 36;
      player.color = wormColor;

      for (let i = 0; i < 22; i++) {
        player.trail.push({ x: player.x, y: player.y + i * 3 });
      }

      isBoosting = false;
      mobileInput.active = false;
      mobileInput.dx = 0;
      mobileInput.dy = -1;
      mobileInput.boost = false;

      bots = createBotPool(24);
      orbs = Array.from({ length: 420 }, () => createOrb());
      powerUps = [];
      for (let i = 0; i < 4; i++) spawnPowerUp();

      setScore(0);
      setKills(0);
      if (onKillsUpdate) onKillsUpdate(0);
      if (onScoreUpdate) onScoreUpdate(0);

      setShareAvailable(false);
      setLastScore(null);
      setShowDeathModal(false);
      isPausedRef.current = false;
      setIsPaused(false);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
      setHintVisible(false);
    };

    const onTouchMove = (e: TouchEvent) => {
      if ((e.target as HTMLElement)?.closest('[data-mobile-control="true"]')) return;
      if (!e.touches.length) return;
      const rect = container.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
      mouse.active = true;
      setHintVisible(false);
      e.preventDefault();
    };

    const onMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('button')) return;
      isBoosting = true;
      sounds.playBoostSound();
    };

    const onMouseUp = () => { isBoosting = false; };

    const onTouchStart = (e: TouchEvent) => {
      if ((e.target as HTMLElement)?.closest('[data-mobile-control="true"]')) return;
      if ((e.target as HTMLElement).closest('button')) return;
      isBoosting = true;
      sounds.playBoostSound();
    };

    const onTouchEnd = () => { isBoosting = false; };

    const onKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'ShiftLeft'].includes(e.code)) {
        if (!isBoosting) sounds.playBoostSound();
        isBoosting = true;
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        player.angle -= 0.14;
        mouse.active = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        player.angle += 0.14;
        mouse.active = false;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (['Space', 'ShiftLeft'].includes(e.code)) isBoosting = false;
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // DRAW CYBER ARENA GRID & AMBIENT GLOW
    const drawGrid = () => {
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 245, 212, 0.07)';
      ctx.lineWidth = 1.0;

      const gridSize = 48;
      const startX = Math.floor(camera.x / gridSize) * gridSize;
      const endX = camera.x + width + gridSize;
      const startY = Math.floor(camera.y / gridSize) * gridSize;
      const endY = camera.y + height + gridSize;

      ctx.beginPath();
      for (let x = startX; x <= endX; x += gridSize) {
        ctx.moveTo(x, camera.y);
        ctx.lineTo(x, camera.y + height);
      }
      for (let y = startY; y <= endY; y += gridSize) {
        ctx.moveTo(camera.x, y);
        ctx.lineTo(camera.x + width, y);
      }
      ctx.stroke();

      // Soft Hexagonal nodes
      ctx.fillStyle = 'rgba(255, 0, 127, 0.04)';
      for (let x = startX; x <= endX; x += gridSize * 2) {
        for (let y = startY; y <= endY; y += gridSize * 2) {
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    };

    // DRAW VIBRANT SEGMENTED WORM
    const drawSlinkWorm = (
      points: TrailPoint[],
      headX: number,
      headY: number,
      angle: number,
      color: string,
      coreColor: string,
      eyeColor: string,
      baseThickness: number,
      isPlayer = false,
      boosting = false,
      hasPhaseShield = false
    ) => {
      if (points.length < 2) return;

      ctx.save();

      // 1. Outer Glow Aura
      ctx.shadowBlur = boosting ? 26 : 14;
      ctx.shadowColor = hasPhaseShield ? '#38bdf8' : color;

      // 2. Segmented Body: Draw smooth tapered circles
      const segmentCount = points.length;
      for (let i = segmentCount - 1; i >= 0; i--) {
        const pt = points[i];
        const progress = 1 - i / segmentCount; // 1 at head, 0 at tail
        const segRadius = (baseThickness / 2) * (0.45 + progress * 0.55);

        // Segment Outer Ring
        ctx.fillStyle = hasPhaseShield ? 'rgba(56, 189, 248, 0.85)' : color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, segRadius, 0, Math.PI * 2);
        ctx.fill();

        // Inner glowing core
        if (i % 2 === 0) {
          ctx.fillStyle = coreColor;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, Math.max(1, segRadius * 0.45), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Connective smooth line for seamless flow
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = hasPhaseShield ? '#38bdf8' : color;
      ctx.lineWidth = baseThickness;
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();

      // Inner Core Line
      ctx.strokeStyle = coreColor;
      ctx.lineWidth = baseThickness * 0.35;
      ctx.stroke();

      // 4. Expressive Worm Head
      ctx.save();
      ctx.translate(headX, headY);
      ctx.rotate(angle + Math.PI / 2);

      const headRadius = baseThickness * 0.95;

      // Antennae / Horns
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(-headRadius * 0.5, -headRadius * 0.8);
      ctx.lineTo(-headRadius * 0.9, -headRadius * 1.5);
      ctx.moveTo(headRadius * 0.5, -headRadius * 0.8);
      ctx.lineTo(headRadius * 0.9, -headRadius * 1.5);
      ctx.stroke();

      // Antenna glowing tip bulbs
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-headRadius * 0.9, -headRadius * 1.5, 2.0, 0, Math.PI * 2);
      ctx.arc(headRadius * 0.9, -headRadius * 1.5, 2.0, 0, Math.PI * 2);
      ctx.fill();

      // Main Head Dome
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, headRadius, 0, Math.PI * 2);
      ctx.fill();

      // Head Highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(0, -headRadius * 0.25, headRadius * 0.6, 0, Math.PI);
      ctx.fill();

      // Cute / Fierce Expressive Eyes
      const eyeOffsetX = headRadius * 0.48;
      const eyeOffsetY = -headRadius * 0.25;
      const eyeRadius = headRadius * 0.32;
      const pupilRadius = eyeRadius * 0.5;

      [-eyeOffsetX, eyeOffsetX].forEach((ex) => {
        // Eye White
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ex, eyeOffsetY, eyeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Eye Iris
        ctx.fillStyle = eyeColor || '#002820';
        ctx.beginPath();
        ctx.arc(ex, eyeOffsetY - 0.8, pupilRadius, 0, Math.PI * 2);
        ctx.fill();

        // Glint
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ex + 0.6, eyeOffsetY - 1.4, pupilRadius * 0.45, 0, Math.PI * 2);
        ctx.fill();
      });

      // Phase Shield Aura around Head
      if (hasPhaseShield) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#38bdf8';
        ctx.beginPath();
        ctx.arc(0, 0, headRadius * 1.8, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();

      // Boost exhaust sparks
      if (boosting && frame % 2 === 0) {
        emitSparks(headX - Math.cos(angle) * 12, headY - Math.sin(angle) * 12, color, 3, 1.8);
      }

      // Callsign tag above head
      ctx.shadowBlur = 0;
      ctx.fillStyle = isPlayer ? '#00f5d4' : color;
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillText(isPlayer ? callsign || 'SLINK_VIPER' : color, headX - 20, headY - headRadius - 10);

      ctx.restore();
    };

    // MAIN GAME LOOP
    const render = () => {
      frame++;

      if (screenShake > 0) {
        screenShake *= 0.88;
        if (screenShake < 0.2) screenShake = 0;
      }

      if (comboTimer > 0) {
        comboTimer--;
        if (comboTimer <= 0) {
          currentCombo = 0;
          setComboCount(0);
        }
      }

      // Update Powerups
      for (let [type, active] of activePowerUps.entries()) {
        active.duration--;
        if (active.duration <= 0) {
          activePowerUps.delete(type);
        }
      }

      if (frame % 10 === 0) {
        setActiveBuffs(
          Array.from(activePowerUps.values()).map((b) => ({
            type: b.type,
            percent: Math.max(0, Math.floor((b.duration / b.maxDuration) * 100)),
          }))
        );
      }

      if (frame % 480 === 0) spawnPowerUp();

      // Player Movement Logic
      const hasMagnet = activePowerUps.has('magnet');
      const hasOverclock = activePowerUps.has('overclock');
      const hasPhase = activePowerUps.has('phase');

      let boostActive = (isBoosting || mobileInput.boost || hasOverclock) && !isPausedRef.current;
      let currentSpeed = (boostActive ? player.boostSpeed : player.baseSpeed) * (hasOverclock ? 1.3 : 1.0);

      if (!isPausedRef.current) {
        if (mobileInput.active) {
          const targetAngle = Math.atan2(mobileInput.dy, mobileInput.dx);
          let diff = targetAngle - player.angle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          player.angle += diff * (boostActive ? 0.14 : 0.09);
        } else if (mouse.active) {
          const worldMouseX = mouse.x + camera.x;
          const worldMouseY = mouse.y + camera.y;
          const targetAngle = Math.atan2(worldMouseY - player.y, worldMouseX - player.x);
          let diff = targetAngle - player.angle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          player.angle += diff * (boostActive ? 0.14 : 0.09);
        }

        player.x += Math.cos(player.angle) * currentSpeed;
        player.y += Math.sin(player.angle) * currentSpeed;

        player.trail.unshift({ x: player.x, y: player.y });
        if (player.trail.length > player.maxTrail) player.trail.pop();

        if (boostActive && !hasOverclock) {
          localScore = Math.max(10, localScore - 0.2);
          if (frame % 4 === 0) emitSparks(player.x, player.y, player.color, 2, 1.2);
        }
      }

      // Camera Follow Smooth
      camera.x += (player.x - width / 2 - camera.x) * 0.1;
      camera.y += (player.y - height / 2 - camera.y) * 0.1;

      // Clear & Pre-render Transform
      ctx.save();
      ctx.fillStyle = '#060814';
      ctx.fillRect(0, 0, width, height);

      const shakeX = (Math.random() - 0.5) * screenShake;
      const shakeY = (Math.random() - 0.5) * screenShake;
      ctx.translate(-camera.x + shakeX, -camera.y + shakeY);

      // Draw Cyber Arena Grid
      drawGrid();

      // Draw Arena Energy Boundary
      ctx.save();
      ctx.shadowBlur = 28;
      ctx.shadowColor = '#00f5d4';
      ctx.strokeStyle = '#00f5d4';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(ARENA_CENTER_X, ARENA_CENTER_Y, ARENA_RADIUS, 0, Math.PI * 2);
      ctx.stroke();

      // Danger Zone Ring
      ctx.strokeStyle = 'rgba(255, 0, 127, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.arc(ARENA_CENTER_X, ARENA_CENTER_Y, ARENA_RADIUS - 15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Check Player Wall Crash
      const playerDistFromCenter = Math.hypot(player.x - ARENA_CENTER_X, player.y - ARENA_CENTER_Y);
      if (playerDistFromCenter >= ARENA_RADIUS - 10) {
        emitSparks(player.x, player.y, '#00ff88', 40, 3.5);
        screenShake = 16;
        addScorePopup(player.x, player.y - 20, `CRASHED! -200`, '#ff007f');
        sounds.playShatter();

        setAlertText('ENERGY WALL COLLISION');
        setAlertColor('#ff007f');
        dropLootOrbs(player.x, player.y, localScore);

        setTimeout(() => setAlertText('ARENA LIVE'), 2600);

        localScore = Math.max(0, localScore - 200);
        setScore(Math.floor(localScore));
        setBestToday((prev) => Math.max(prev, Math.floor(localScore)));

        if (onScoreUpdate) onScoreUpdate(Math.floor(localScore));

        player.x = ARENA_CENTER_X;
        player.y = ARENA_CENTER_Y;
        player.angle = -Math.PI / 2;
        player.trail = [];
        for (let i = 0; i < 22; i++) player.trail.push({ x: player.x, y: player.y + i * 3 });

        isBoosting = false;
        mobileInput.boost = false;
        isPausedRef.current = true;
        setIsPaused(true);

        setLastScore(Math.floor(localScore));
        setShareAvailable(true);
        setShowDeathModal(true);
      }

      // Draw & Check Powerups
      for (let pIdx = powerUps.length - 1; pIdx >= 0; pIdx--) {
        const pup = powerUps[pIdx];
        pup.pulse += 0.05;
        const pulseR = pup.radius + Math.sin(pup.pulse) * 3;

        ctx.save();
        ctx.shadowBlur = 18;
        const colorMap = { magnet: '#a855f7', phase: '#38bdf8', overclock: '#ffaa00' };
        ctx.shadowColor = colorMap[pup.type];
        ctx.fillStyle = colorMap[pup.type];
        ctx.beginPath();
        ctx.arc(pup.x, pup.y, pulseR, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px "JetBrains Mono"';
        ctx.fillText(pup.type.toUpperCase(), pup.x - 14, pup.y - 12);
        ctx.restore();

        // Check collection
        const pDist = Math.hypot(player.x - pup.x, player.y - pup.y);
        if (pDist < player.thickness + pup.radius + 8) {
          activePowerUps.set(pup.type, { type: pup.type, duration: 420, maxDuration: 420 });
          sounds.playBeep(880);
          emitSparks(pup.x, pup.y, colorMap[pup.type], 25, 2.5);
          addScorePopup(pup.x, pup.y - 20, `${pup.type.toUpperCase()} ACTIVATED!`, colorMap[pup.type], 1.2);
          powerUps.splice(pIdx, 1);
        }
      }

      // Draw & Eat Food Orbs
      for (let i = orbs.length - 1; i >= 0; i--) {
        const orb = orbs[i];
        orb.pulse += 0.05;
        orb.x += orb.vx;
        orb.y += orb.vy;
        orb.vx *= 0.98;
        orb.vy *= 0.98;

        // Magnet attraction
        if (hasMagnet) {
          const mDist = Math.hypot(player.x - orb.x, player.y - orb.y);
          if (mDist < 260) {
            const pullAngle = Math.atan2(player.y - orb.y, player.x - orb.x);
            orb.x += Math.cos(pullAngle) * 6;
            orb.y += Math.sin(pullAngle) * 6;

            // Draw luminous tractor beam
            if (i % 6 === 0) {
              ctx.save();
              ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(orb.x, orb.y);
              ctx.lineTo(player.x, player.y);
              ctx.stroke();
              ctx.restore();
            }
          }
        }

        // Draw Orb
        ctx.save();
        ctx.shadowBlur = orb.isLoot ? 16 : 8;
        ctx.shadowColor = orb.color;
        ctx.fillStyle = orb.color;
        ctx.beginPath();
        const r = orb.radius + Math.sin(orb.pulse) * 0.8;
        ctx.arc(orb.x, orb.y, Math.max(1.5, r), 0, Math.PI * 2);
        ctx.fill();

        // Star orb glint
        if (orb.type === 'star') {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, r * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Player eats orb
        const dist = Math.hypot(player.x - orb.x, player.y - orb.y);
        if (dist < player.thickness + orb.radius + 6) {
          if (!isPausedRef.current) {
            const comboMult = 1 + Math.min(4, currentCombo * 0.5);
            const gainedScore = Math.floor(orb.value * comboMult);

            localScore += gainedScore;
            player.maxTrail = Math.min(180, player.maxTrail + (orb.isLoot ? 2 : 1));

            emitSparks(orb.x, orb.y, orb.color, orb.isLoot ? 12 : 6, 1.2);
            addScorePopup(orb.x, orb.y - 10, `+${gainedScore}`, orb.color);
            sounds.playOrbChime(orb.value);

            if (orb.isLoot) {
              orbs.splice(i, 1);
            } else {
              orbs[i] = createOrb();
            }

            setScore(Math.floor(localScore));
            setBestToday((prev) => Math.max(prev, Math.floor(localScore)));
            if (onScoreUpdate) onScoreUpdate(Math.floor(localScore));
          }
        }
      }

      // BOT LOGIC & COMBAT
      bots.forEach((bot, bIdx) => {
        if (isPausedRef.current) return;

        if (bot.isFastPasser && frame % 2 === 0) {
          emitSparks(bot.x, bot.y, '#ff0055', 2, 2.0);
        }

        // Steer toward orbs
        let closestOrb: Orb | null = null;
        let minDist = 200;

        for (let i = 0; i < orbs.length; i += 2) {
          const d = Math.hypot(orbs[i].x - bot.x, orbs[i].y - bot.y);
          if (d < minDist) {
            minDist = d;
            closestOrb = orbs[i];
          }
        }

        if (!bot.isFastPasser && closestOrb) {
          const targetAngle = Math.atan2(closestOrb.y - bot.y, closestOrb.x - bot.x);
          let diff = targetAngle - bot.angle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          bot.angle += diff * bot.turnRate;
        } else {
          bot.angle += (Math.random() - 0.5) * (bot.isFastPasser ? 0.02 : 0.08);
        }

        bot.x += Math.cos(bot.angle) * bot.speed;
        bot.y += Math.sin(bot.angle) * bot.speed;

        const botDist = Math.hypot(bot.x - ARENA_CENTER_X, bot.y - ARENA_CENTER_Y);
        if (botDist >= ARENA_RADIUS - 15) {
          bots[bIdx] = createSingleBot(bIdx);
        }

        bot.trail.unshift({ x: bot.x, y: bot.y });
        if (bot.trail.length > bot.maxTrail) bot.trail.pop();

        // Bot eats orbs
        for (let i = orbs.length - 1; i >= 0; i--) {
          const d = Math.hypot(orbs[i].x - bot.x, orbs[i].y - bot.y);
          if (d < bot.thickness + orbs[i].radius + 5) {
            emitSparks(orbs[i].x, orbs[i].y, bot.color, 4, 0.8);
            if (orbs[i].isLoot) {
              orbs.splice(i, 1);
            } else {
              orbs[i] = createOrb();
            }
          }
        }

        // 1. PLAYER CUTS BOT (Player Victory)
        for (let t = 6; t < player.trail.length; t++) {
          const td = Math.hypot(player.trail[t].x - bot.x, player.trail[t].y - bot.y);
          if (td < player.thickness + 6) {
            localKills += 1;
            currentCombo += 1;
            comboTimer = 260;
            setComboCount(currentCombo);

            const baseKillScore = bot.isFastPasser ? 1200 : 500;
            const comboBonus = currentCombo * 180;
            const totalKillAward = baseKillScore + comboBonus;
            localScore += totalKillAward;

            screenShake = 16;
            emitSparks(bot.x, bot.y, bot.color, 50, 4.0);

            const comboLabel = currentCombo > 1 ? ` (${currentCombo}X SLINK COMBO!)` : '';
            addScorePopup(bot.x, bot.y - 20, `${bot.name} SHATTERED! +${totalKillAward}${comboLabel}`, '#ff007f', 1.3);
            sounds.playShatter();

            dropLootOrbs(bot.x, bot.y, bot.score || 450);

            setAlertText(currentCombo > 1 ? `MULTI-SLINK x${currentCombo}!` : `${bot.name} ELIMINATED`);
            setAlertColor('#ff007f');
            setTimeout(() => setAlertText('ARENA LIVE'), 2600);

            setKills(localKills);
            setScore(Math.floor(localScore));
            setBestToday((prev) => Math.max(prev, Math.floor(localScore)));

            if (onKillsUpdate) onKillsUpdate(localKills);
            if (onScoreUpdate) onScoreUpdate(Math.floor(localScore));

            bots[bIdx] = createSingleBot(bIdx);
            break;
          }
        }

        // 2. BOT CUTS PLAYER (Bot Victory unless Phase Shield active)
        if (!hasPhase) {
          for (let t = 6; t < bot.trail.length; t++) {
            const pd = Math.hypot(bot.trail[t].x - player.x, bot.trail[t].y - player.y);
            if (pd < player.thickness + 5) {
              screenShake = 18;
              emitSparks(player.x, player.y, player.color, 45, 3.5);
              addScorePopup(player.x, player.y - 20, `ELIMINATED BY ${bot.name}`, '#ff007f');
              sounds.playShatter();

              dropLootOrbs(player.x, player.y, localScore);

              setAlertText(`KILLED BY ${bot.name}`);
              setAlertColor('#ff007f');
              setTimeout(() => setAlertText('ARENA LIVE'), 2600);

              bot.score = (bot.score || 0) + 500;
              localScore = Math.max(0, localScore - 200);

              setScore(Math.floor(localScore));
              setBestToday((prev) => Math.max(prev, Math.floor(localScore)));
              if (onScoreUpdate) onScoreUpdate(Math.floor(localScore));

              player.x = ARENA_CENTER_X;
              player.y = ARENA_CENTER_Y;
              player.angle = -Math.PI / 2;
              player.trail = [];
              for (let i = 0; i < 22; i++) player.trail.push({ x: player.x, y: player.y + i * 3 });

              isBoosting = false;
              mobileInput.boost = false;
              isPausedRef.current = true;
              setIsPaused(true);

              setLastScore(Math.floor(localScore));
              setShareAvailable(true);
              setShowDeathModal(true);
              break;
            }
          }
        }
      });

      // DRAW BOT WORMS
      bots.forEach((bot) => {
        drawSlinkWorm(
          bot.trail,
          bot.x,
          bot.y,
          bot.angle,
          bot.color,
          bot.coreColor,
          bot.eyeColor,
          bot.thickness,
          false,
          bot.isFastPasser
        );
      });

      // DRAW PLAYER WORM
      drawSlinkWorm(
        player.trail,
        player.x,
        player.y,
        player.angle,
        player.color,
        '#ffffff',
        '#002820',
        player.thickness,
        true,
        boostActive,
        hasPhase
      );

      // PARTICLES
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // FLOATING TEXT
      for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const ft = floatingTexts[i];
        ft.y -= 0.8;
        ft.life -= ft.decay;

        if (ft.life <= 0) {
          floatingTexts.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = ft.life;
        const textSize = Math.floor(12 * (ft.scale || 1));
        ctx.font = `bold ${textSize}px "JetBrains Mono", monospace`;
        ctx.fillStyle = ft.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = ft.color;
        ctx.fillText(ft.text, ft.x - 10, ft.y);
        ctx.restore();
      }

      ctx.restore();

      // UPDATE LEADERBOARD ROSTER
      if (frame % 30 === 0 && !isPausedRef.current) {
        try {
          setRoster(() => {
            const sortedBots = [...bots]
              .sort((a, b) => b.score - a.score)
              .map((b) => ({ name: b.name, score: Math.floor(b.score || 0), color: b.color }));

            const playerEntry = {
              name: callsign || 'SLINK_VIPER',
              score: Math.floor(localScore),
              isPlayer: true,
              color: player.color,
            };

            return [...sortedBots, playerEntry]
              .sort((a, b) => b.score - a.score)
              .slice(0, 6);
          });
        } catch {}
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      observer.disconnect();
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [callsign, wormColor, onKillsUpdate, onScoreUpdate]);

  return (
    <div
      ref={containerRef}
      className={`
        relative rounded-2xl bg-[#060814] border border-cyan-500/30
        shadow-[0_0_40px_rgba(0,245,212,0.15),0_12px_45px_rgba(0,0,0,0.8)]
        ${isFullscreen ? 'overflow-visible' : 'overflow-hidden'}
        flex flex-col justify-between p-4 select-none group/arena
        ${isFullscreen ? 'w-full h-full min-h-screen' : 'h-[min(78vh,620px)] min-h-[440px] sm:min-h-[500px] sm:h-[600px]'}
      `}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block cursor-crosshair z-0" />

      {/* START PLAY OVERLAY */}
      {isPaused && !showDeathModal && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-auto">
          <div className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-cyan-500/30 bg-[#0c1026]/90 shadow-[0_0_40px_rgba(0,245,212,0.3)]">
            <span className="font-mono text-xs text-cyan-300 font-bold uppercase tracking-widest">
              SLINK ARENA ENGINE READY
            </span>
            <button
              type="button"
              onClick={playGame}
              className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#00f5d4] via-[#00ff88] to-[#00f5d4] px-8 py-3.5 font-display text-sm font-black tracking-widest text-[#002820] uppercase shadow-[0_0_25px_rgba(0,245,212,0.6)] hover:scale-105 transition-all cursor-pointer"
            >
              <Play className="h-4 w-4 fill-current" />
              SLITHER TO PLAY
            </button>
            <span className="font-mono text-[10px] text-slate-400">
              Steer: Move cursor · Boost: Hold Click
            </span>
          </div>
        </div>
      )}

      {/* ACTIVE POWER-UP HUD */}
      <div className="absolute top-[135px] left-4 z-20 flex flex-col gap-2 pointer-events-none md:top-[160px]">
        {activeBuffs.map((buff) => (
          <div
            key={buff.type}
            className="flex items-center gap-2 bg-[#0c1026]/90 border border-white/20 px-3 py-1.5 rounded-lg backdrop-blur-md shadow-lg"
          >
            {buff.type === 'magnet' && <Magnet className="w-4 h-4 text-purple-400 animate-pulse" />}
            {buff.type === 'phase' && <Shield className="w-4 h-4 text-cyan-400 animate-pulse" />}
            {buff.type === 'overclock' && <Zap className="w-4 h-4 text-amber-400 animate-pulse" />}
            <span className="font-mono text-[10px] text-white font-bold uppercase">{buff.type}</span>
            <div className="w-14 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 transition-all duration-75"
                style={{ width: `${buff.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* MULTI-KILL COMBO OVERLAY */}
      {comboCount > 1 && (
        <div className="absolute top-20 right-1/2 translate-x-1/2 z-20 pointer-events-none animate-bounce">
          <div className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-mono text-xs md:text-sm font-black px-5 py-1.5 rounded-full shadow-[0_0_25px_rgba(255,0,127,0.8)] border border-white/40 tracking-widest uppercase">
            🔥 {comboCount}X SLINK STREAK! 🔥
          </div>
        </div>
      )}

      {/* MOBILE CONTROLLER */}
      <div
        className={`absolute inset-x-0 z-30 pointer-events-none px-4 ${isFullscreen ? 'bottom-12 md:bottom-12' : 'bottom-0 md:bottom-2'}`}
        style={{ paddingBottom: isFullscreen ? 'calc(48px + env(safe-area-inset-bottom))' : 'calc(18px + env(safe-area-inset-bottom))' }}
      >
        <div className="relative w-full h-[104px]">
          <button
            data-mobile-control="true"
            type="button"
            className="absolute left-0 bottom-3 w-[78px] h-[78px] rounded-full border border-amber-400/60 bg-[#1b1913]/90 text-amber-300 font-mono text-[10px] font-bold tracking-widest shadow-[0_0_20px_rgba(255,170,0,0.3)] active:scale-95 active:bg-[#2b2216] touch-none select-none flex items-center justify-center z-40 cursor-pointer pointer-events-auto"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
              if (!mobileInputRef.current.boost) sounds.playBoostSound();
              mobileInputRef.current.boost = true;
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              mobileInputRef.current.boost = false;
              try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
            }}
            onPointerCancel={() => { mobileInputRef.current.boost = false; }}
          >
            BOOST
          </button>

          <div
            data-mobile-control="true"
            className="absolute right-0 bottom-0 w-[104px] h-[104px] rounded-full border border-cyan-400/40 bg-[#060814]/85 backdrop-blur-sm shadow-[0_0_25px_rgba(0,245,212,0.2)] pointer-events-auto touch-none select-none z-40"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.setPointerCapture(e.pointerId);

              const el = e.currentTarget;
              const r = el.getBoundingClientRect();

              const updateJoystick = (clientX: number, clientY: number) => {
                const cx = r.left + r.width / 2;
                const cy = r.top + r.height / 2;
                const max = r.width * 0.36;

                let dx = clientX - cx;
                let dy = clientY - cy;
                const len = Math.hypot(dx, dy) || 1;
                const amount = Math.min(1, len / max);

                mobileInputRef.current.active = amount > 0.05;
                mobileInputRef.current.dx = (dx / len) * amount;
                mobileInputRef.current.dy = (dy / len) * amount;
              };

              updateJoystick(e.clientX, e.clientY);
              setHintVisible(false);
            }}
            onPointerMove={(e) => {
              if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
              const r = e.currentTarget.getBoundingClientRect();
              const cx = r.left + r.width / 2;
              const cy = r.top + r.height / 2;
              const max = r.width * 0.36;

              let dx = e.clientX - cx;
              let dy = e.clientY - cy;
              const len = Math.hypot(dx, dy) || 1;
              const amount = Math.min(1, len / max);

              mobileInputRef.current.active = amount > 0.05;
              mobileInputRef.current.dx = (dx / len) * amount;
              mobileInputRef.current.dy = (dy / len) * amount;
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              mobileInputRef.current.active = false;
              mobileInputRef.current.dx = 0;
              mobileInputRef.current.dy = -1;
              try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
            }}
            onPointerCancel={() => {
              mobileInputRef.current.active = false;
              mobileInputRef.current.dx = 0;
              mobileInputRef.current.dy = -1;
            }}
          >
            <div className="absolute inset-2 rounded-full border border-cyan-400/20" />
            <div className="absolute inset-5 rounded-full border border-cyan-400/10" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-cyan-400/80 bg-cyan-950/90 shadow-[0_0_15px_rgba(0,245,212,0.3)] flex items-center justify-center">
              <span className="text-[9px] font-mono font-bold tracking-widest text-cyan-300">MOVE</span>
            </div>
          </div>
        </div>
      </div>

      {hintVisible && (
        <div className="absolute bottom-[125px] left-1/2 -translate-x-1/2 z-20 pointer-events-none whitespace-nowrap">
          <span className="font-mono text-[9px] tracking-widest text-[#00f5d4] uppercase px-3 py-1.5 rounded-lg bg-[#060814]/90 border border-cyan-400/40 shadow-md">
            MOVE CURSOR TO STEER · HOLD BOOST TO DASH
          </span>
        </div>
      )}

      {/* DEATH MODAL */}
      {showDeathModal && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="w-[340px] rounded-3xl border border-cyan-500/40 bg-[#0c1026]/95 p-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,245,212,0.2)]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 text-pink-400" />
              WORM SHATTERED
            </div>

            <div className="font-display text-2xl font-black uppercase tracking-tight text-white">
              ROUND COMPLETE
            </div>

            <div className="my-4 p-4 rounded-xl bg-[#060814] border border-white/10 flex flex-col gap-2">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-slate-400">Final Score:</span>
                <span className="text-cyan-300 font-black text-base">{lastScore?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-slate-400">Rivals Shattered:</span>
                <span className="text-pink-300 font-bold">{kills}</span>
              </div>
              <div className="flex justify-between items-center font-mono text-xs border-t border-white/10 pt-2">
                <span className="text-slate-400">Best Today:</span>
                <span className="text-amber-300 font-bold">{bestToday.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={shareThenRestart}
                className="flex items-center gap-2 rounded-xl border border-sky-400/60 bg-sky-500/20 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wide text-white hover:bg-sky-500/40 transition-all cursor-pointer"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
              <button
                onClick={playAgain}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00f5d4] via-[#00ff88] to-[#00f5d4] px-5 py-2.5 font-mono text-xs font-black uppercase tracking-wide text-[#002820] hover:scale-105 shadow-[0_0_20px_rgba(0,245,212,0.5)] transition-all cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP HUD */}
      <div className="relative z-10 w-full flex items-start justify-between gap-4 pointer-events-none">
        {/* Score Card */}
        <div className="pointer-events-auto bg-[#0c1026]/90 border border-cyan-400/40 rounded-xl p-3 shadow-[0_0_20px_rgba(0,245,212,0.15)] flex flex-col min-w-[110px] md:min-w-[140px] backdrop-blur-md">
          <span className="font-mono text-[9px] text-cyan-400/80 tracking-widest uppercase font-bold">
            SLINK SCORE
          </span>
          <span className="font-display text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(0,245,212,0.5)]">
            {score.toLocaleString()}
          </span>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 pt-1 border-t border-white/10 mt-1">
            <span>KILLS</span>
            <span className="text-pink-400 font-bold">{kills}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 mt-0.5">
            <span>RECORD</span>
            <span className="text-amber-400 font-bold">{bestToday.toLocaleString()}</span>
          </div>
        </div>

        {/* Right Controls & Leaderboard */}
        <div className="pointer-events-auto flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            {onToggleFullscreen && (
              <button
                onClick={() => {
                  sounds.playBeep(600);
                  onToggleFullscreen();
                }}
                className="text-slate-300 hover:text-[#00f5d4] transition-colors cursor-pointer p-1.5 rounded-lg bg-[#0c1026]/80 border border-white/10 hover:border-cyan-400/50"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Alert Status Pill */}
          <div
            className="hidden md:flex bg-[#0c1026]/90 border rounded-full px-3 py-1 items-center gap-1.5 shadow-[0_0_12px_rgba(0,245,212,0.2)] backdrop-blur-md"
            style={{ borderColor: alertColor + '70' }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: alertColor }} />
            <span className="font-mono text-[9px] font-bold tracking-wider uppercase" style={{ color: alertColor }}>
              {alertText}
            </span>
          </div>

          {/* Mini Roster */}
          <div className="hidden md:flex relative bg-[#0c1026]/90 border border-cyan-400/30 rounded-xl p-3 shadow-[0_0_20px_rgba(0,0,0,0.6)] min-w-[170px] flex-col backdrop-blur-md">
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-300 uppercase pb-1 mb-1 border-b border-white/10">
              <span className="tracking-wider flex items-center gap-1 font-bold text-cyan-300">
                <Trophy className="w-3 h-3 text-amber-400" /> TOP SLINKS
              </span>
            </div>
            <div className="flex flex-col gap-1 font-mono text-[10px]">
              {roster.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between ${
                    item.isPlayer
                      ? 'text-[#00f5d4] font-bold py-0.5 px-1 rounded bg-cyan-500/15 border border-cyan-400/30'
                      : 'text-slate-300'
                  }`}
                >
                  <span className="truncate max-w-[100px] flex items-center gap-1">
                    <span className={idx === 0 ? 'text-amber-400 font-black' : 'text-slate-500'}>
                      {idx + 1}.
                    </span>{' '}
                    {item.name}
                  </span>
                  <span className={item.isPlayer ? 'text-[#00f5d4]' : 'text-slate-200 font-bold'}>
                    {item.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
