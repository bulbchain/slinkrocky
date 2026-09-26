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
import { SlinkHungry } from './RetroCartoonCharacters';

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

export type FoodType = 'orange' | 'strawberry' | 'plum' | 'apple';
export type SoilCreatureType = 'centipede' | 'snake' | 'slug' | 'worm';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

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
  foodType: FoodType;
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

interface ComicBurst {
  x: number;
  y: number;
  text: 'POW!' | 'ZAP!';
  color: string;
  textColor: string;
  life: number;
  decay: number;
  rotation: number;
  points: number;
  innerR: number;
  outerR: number;
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
  creatureType: SoilCreatureType;
  isHunting?: boolean;
  isBotBoosting?: boolean;
  boostTimer?: number;
  fruitsEaten?: number;
  circleCounter?: number;
  lastTargetOrbId?: number;
}

const ORB_PALETTE = [
  '#FF5D8F', // Electric Neon Strawberry Pink
  '#FF9E00', // Radiant Sun Orange
  '#B4F000', // Energetic Lime Glow
  '#55B3F3', // Bright Cyan Sky
  '#9D4EDD', // Electric Purple Grape
  '#00F5D4', // Vibrant Cyber Mint
];

export const ArenaCanvas: React.FC<ArenaCanvasProps> = ({
  callsign,
  wormColor = '#FA824C',
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

  // Active Comic Chomp Overlay ('POW!' or 'ZAP!')
  const [chompOverlay, setChompOverlay] = useState<{
    id: number;
    text: 'POW!' | 'ZAP!';
    color: string;
    textColor: string;
    screenX: number;
    screenY: number;
    rotation: number;
  } | null>(null);
  const chompTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const difficultyRef = useRef<DifficultyLevel>('medium');
  difficultyRef.current = difficulty;

  const [score, setScore] = useState<number>(0);
  const [kills, setKills] = useState<number>(0);
  const [bestToday, setBestToday] = useState<number>(6420);
  const [comboCount, setComboCount] = useState<number>(0);
  const [activeBuffs, setActiveBuffs] = useState<{ type: PowerUpType; percent: number }[]>([]);

  const [alertText, setAlertText] = useState<string>('ARENA LIVE');
  const [alertColor, setAlertColor] = useState<string>('#00f5d4');
  const [hintVisible, setHintVisible] = useState<boolean>(true);

  const [roster, setRoster] = useState<{ name: string; score: number; isPlayer?: boolean; color?: string }[]>([
    { name: '⚡ NEON_STRIKE', score: 8420, color: '#FF0055' },
    { name: '🐍 CYBER_VIPER', score: 6810, color: '#00F5D4' },
    { name: '🐛 HYPER_CENTI', score: 5320, color: '#FF7700' },
    { name: '🐌 TOXIC_SLUG', score: 4190, color: '#B4F000' },
    { name: '🪱 SOLAR_WOBBLER', score: 3250, color: '#55B3F3' },
    { name: callsign || '🪱 SLINK_VIPER', score: 450, isPlayer: true, color: wormColor },
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

      // User requested fruit types: orange, strawberry, plum (and classic apples)
      let foodType: FoodType;
      if (isLoot) {
        const lootFruits: FoodType[] = ['strawberry', 'orange', 'plum'];
        foodType = lootFruits[Math.floor(Math.random() * lootFruits.length)];
      } else {
        const fruitPool: FoodType[] = ['orange', 'strawberry', 'plum', 'apple'];
        foodType = fruitPool[Math.floor(Math.random() * fruitPool.length)];
      }

      const foodMeta: Record<FoodType, { color: string; baseR: number; baseVal: number }> = {
        orange: { color: '#FA824C', baseR: 5.6, baseVal: 45 },
        strawberry: { color: '#E63946', baseR: 6.0, baseVal: 55 },
        plum: { color: '#7B2CBF', baseR: 5.8, baseVal: 65 },
        apple: { color: '#D90429', baseR: 5.4, baseVal: 35 },
      };

      const meta = foodMeta[foodType];
      const radius = isLoot ? meta.baseR * 1.35 : meta.baseR + (Math.random() * 1.2 - 0.6);
      const value = isLoot ? Math.floor(lootValue * (meta.baseVal / 45)) : meta.baseVal;

      return {
        x: orbX,
        y: orbY,
        radius,
        color: meta.color,
        pulse: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * (isLoot ? 3.5 : 0.4),
        vy: (Math.random() - 0.5) * (isLoot ? 3.5 : 0.4),
        value,
        isLoot,
        foodType,
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
    const comicBursts: ComicBurst[] = [];

    const drawBurstPolygon = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      points: number,
      outerRadius: number,
      innerRadius: number
    ) => {
      let rot = (Math.PI / 2) * 3;
      const step = Math.PI / points;
      context.beginPath();
      context.moveTo(cx, cy - outerRadius);
      for (let p = 0; p < points; p++) {
        let x = cx + Math.cos(rot) * outerRadius;
        let y = cy + Math.sin(rot) * outerRadius;
        context.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        context.lineTo(x, y);
        rot += step;
      }
      context.lineTo(cx, cy - outerRadius);
      context.closePath();
    };

    const triggerChompOverlay = (
      text: 'POW!' | 'ZAP!',
      color: string,
      textColor: string,
      screenX: number,
      screenY: number
    ) => {
      if (chompTimeoutRef.current) {
        clearTimeout(chompTimeoutRef.current);
      }
      const rotation = (Math.random() - 0.5) * 16;
      setChompOverlay({
        id: Date.now() + Math.random(),
        text,
        color,
        textColor,
        screenX,
        screenY,
        rotation,
      });
      chompTimeoutRef.current = setTimeout(() => {
        setChompOverlay(null);
      }, 550);
    };
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

    interface SoilCreatureSkin {
      name: string;
      creatureType: SoilCreatureType;
      color: string;
      coreColor: string;
      eyeColor: string;
      thickness: number;
      baseSpeed: number;
      turnRate: number;
      namePrefix: string;
    }

    const creatureSkins: SoilCreatureSkin[] = [
      // 1. FAST CENTIPEDES (Multi-legged, quick scurrying predators with neon pop highlights)
      { name: 'HYPER_MAGMA', creatureType: 'centipede', color: '#FF0055', coreColor: '#FF9E00', eyeColor: '#B4F000', thickness: 9.5, baseSpeed: 5.3, turnRate: 0.068, namePrefix: '🐛 INFERNO' },
      { name: 'CYBER_CENTI', creatureType: 'centipede', color: '#00F5D4', coreColor: '#7B2CBF', eyeColor: '#FF5D8F', thickness: 9.0, baseSpeed: 5.1, turnRate: 0.062, namePrefix: '🐛 CYBER' },
      { name: 'SOLAR_STRIKE', creatureType: 'centipede', color: '#FF7700', coreColor: '#FFDD00', eyeColor: '#00F5D4', thickness: 9.2, baseSpeed: 5.4, turnRate: 0.070, namePrefix: '🐛 SOLAR' },
      { name: 'ULTRA_VIOLET', creatureType: 'centipede', color: '#8338EC', coreColor: '#3A86FF', eyeColor: '#B4F000', thickness: 9.2, baseSpeed: 5.3, turnRate: 0.066, namePrefix: '🐛 VOID' },

      // 2. SNAKES (Sleek, sinuous, vibrant neon diamond scales with dual-tone eyes and flickering tongue)
      { name: 'CYBER_VIPER', creatureType: 'snake', color: '#00F5D4', coreColor: '#06D6A0', eyeColor: '#111111', thickness: 10.0, baseSpeed: 4.4, turnRate: 0.048, namePrefix: '🐍 VIPER' },
      { name: 'NEON_CORAL', creatureType: 'snake', color: '#FF0055', coreColor: '#FFBE0B', eyeColor: '#111111', thickness: 9.8, baseSpeed: 4.5, turnRate: 0.050, namePrefix: '🐍 CORAL' },
      { name: 'PLASMA_MAMBA', creatureType: 'snake', color: '#B4F000', coreColor: '#00F5D4', eyeColor: '#111111', thickness: 10.2, baseSpeed: 4.6, turnRate: 0.052, namePrefix: '🐍 MAMBA' },
      { name: 'ROYAL_COBRA', creatureType: 'snake', color: '#3A86FF', coreColor: '#8338EC', eyeColor: '#FFBE0B', thickness: 10.4, baseSpeed: 4.3, turnRate: 0.046, namePrefix: '🐍 COBRA' },

      // 3. SLUGS (Modern chunky bio-luminescent slugs with glowing eye stalks)
      { name: 'LIME_GLOW', creatureType: 'slug', color: '#B4F000', coreColor: '#00F5D4', eyeColor: '#111111', thickness: 13.5, baseSpeed: 2.6, turnRate: 0.040, namePrefix: '🐌 TOXIC' },
      { name: 'COSMIC_BERRY', creatureType: 'slug', color: '#FF5D8F', coreColor: '#FFD13B', eyeColor: '#111111', thickness: 13.8, baseSpeed: 2.5, turnRate: 0.038, namePrefix: '🐌 COSMO' },
      { name: 'AQUA_PULSE', creatureType: 'slug', color: '#55B3F3', coreColor: '#B4F000', eyeColor: '#111111', thickness: 13.2, baseSpeed: 2.4, turnRate: 0.038, namePrefix: '🐌 SLIME' },

      // 4. WORMS (Fresh electric candy and pop-art worms with shiny segmentation)
      { name: 'ELECTRIC_TANGERINE', creatureType: 'worm', color: '#FF7700', coreColor: '#FFDD00', eyeColor: '#111111', thickness: 10.0, baseSpeed: 3.4, turnRate: 0.048, namePrefix: '🪱 SLINK' },
      { name: 'CANDY_WOBBLER', creatureType: 'worm', color: '#FF5D8F', coreColor: '#FFFFFF', eyeColor: '#111111', thickness: 9.8, baseSpeed: 3.5, turnRate: 0.050, namePrefix: '🪱 CANDY' },
      { name: 'CYAN_CRAWLER', creatureType: 'worm', color: '#00F5D4', coreColor: '#3A86FF', eyeColor: '#111111', thickness: 10.2, baseSpeed: 3.3, turnRate: 0.046, namePrefix: '🪱 NITRO' },
    ];

    const createSingleBot = (index: number): BotCraft => {
      const skin = creatureSkins[Math.floor(Math.random() * creatureSkins.length)];
      // Centipedes have high probability of being turbo runners; snakes also have fast variants
      const isFastPasser = skin.creatureType === 'centipede'
        ? Math.random() < 0.65
        : skin.creatureType === 'snake'
        ? Math.random() < 0.40
        : Math.random() < 0.20;

      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * (ARENA_RADIUS - 120);
      const bx = ARENA_CENTER_X + Math.cos(angle) * r;
      const by = ARENA_CENTER_Y + Math.sin(angle) * r;

      const bTrail: TrailPoint[] = [];
      const trailLen = isFastPasser ? 45 : Math.floor(Math.random() * 16 + 24);
      for (let j = 0; j < 20; j++) {
        bTrail.push({ x: bx - j * 2.5, y: by - j * 2.5 });
      }

      const botSurnames = [
        'VORTEX', 'APEX', 'NEO', 'DASH', 'FANG', 'STRIDE', 'CHOMP', 'SPEEDY', 'COIL', 'BLAZE', 'VIPER', 'SWIFT'
      ];
      const surname = botSurnames[Math.floor(Math.random() * botSurnames.length)];
      const botName = isFastPasser
        ? `⚡${skin.namePrefix}_${surname}`
        : `${skin.namePrefix}_${surname}_${Math.floor(Math.random() * 89 + 10)}`;

      // Calculate speed: Centipedes and fast variants are notably swift
      let speed = skin.baseSpeed + (Math.random() * 0.6 - 0.3);
      if (isFastPasser) {
        speed = Math.max(speed, 5.4 + Math.random() * 1.0);
      }

      return {
        name: botName,
        color: skin.color,
        coreColor: skin.coreColor,
        eyeColor: skin.eyeColor,
        x: bx,
        y: by,
        angle: Math.random() * Math.PI * 2,
        speed,
        trail: bTrail,
        maxTrail: trailLen,
        thickness: skin.thickness,
        turnRate: isFastPasser ? Math.max(skin.turnRate, 0.055) : skin.turnRate,
        score: isFastPasser ? 850 : Math.floor(Math.random() * 600 + 150),
        skinName: skin.name,
        isFastPasser,
        creatureType: skin.creatureType,
        isHunting: false,
        isBotBoosting: false,
        boostTimer: 0,
        fruitsEaten: 0,
        circleCounter: 0,
        lastTargetOrbId: -1,
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
      comicBursts.length = 0;
      setChompOverlay(null);
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

    // DRAW RETRO CARTOON MEADOW GRID & DOTS
    const drawGrid = () => {
      ctx.save();
      // Cream meadow ground
      ctx.fillStyle = '#FFF8ED';
      ctx.fillRect(camera.x, camera.y, width, height);

      // Vintage comic halftone dots
      ctx.fillStyle = '#E8D8BF';
      const dotSpacing = 36;
      const startX = Math.floor(camera.x / dotSpacing) * dotSpacing;
      const endX = camera.x + width + dotSpacing;
      const startY = Math.floor(camera.y / dotSpacing) * dotSpacing;
      const endY = camera.y + height + dotSpacing;

      for (let x = startX; x <= endX; x += dotSpacing) {
        for (let y = startY; y <= endY; y += dotSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    };

    // DRAW CARTOON SOIL FRUITS: ORANGES, STRAWBERRIES, PLUMS, AND APPLES
    const drawFruit = (
      x: number,
      y: number,
      r: number,
      foodType: FoodType,
      _pulse: number
    ) => {
      ctx.save();
      ctx.translate(x, y);

      if (foodType === 'orange') {
        // 🍊 ORANGE
        // Shadow
        ctx.fillStyle = '#1E1B18';
        ctx.beginPath();
        ctx.ellipse(1, r * 0.92, r * 0.8, r * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();

        // Plump Orange sphere
        ctx.fillStyle = '#FA824C';
        ctx.strokeStyle = '#1E1B18';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Peel texture specks
        ctx.fillStyle = '#D65D1E';
        ctx.beginPath();
        ctx.arc(-r * 0.35, -r * 0.1, 0.8, 0, Math.PI * 2);
        ctx.arc(r * 0.25, r * 0.25, 0.9, 0, Math.PI * 2);
        ctx.arc(-r * 0.1, r * 0.4, 0.8, 0, Math.PI * 2);
        ctx.fill();

        // White crescent shine
        ctx.fillStyle = '#FFFDF8';
        ctx.beginPath();
        ctx.arc(-r * 0.32, -r * 0.32, r * 0.32, 0, Math.PI * 2);
        ctx.fill();

        // Green leaf
        ctx.fillStyle = '#70A288';
        ctx.strokeStyle = '#1E1B18';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.ellipse(r * 0.4, -r * 0.95, r * 0.5, r * 0.25, -0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Brown stem
        ctx.strokeStyle = '#5C3D2E';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.8);
        ctx.lineTo(r * 0.1, -r * 1.15);
        ctx.stroke();
      } else if (foodType === 'strawberry') {
        // 🍓 STRAWBERRY
        // Shadow
        ctx.fillStyle = '#1E1B18';
        ctx.beginPath();
        ctx.ellipse(1, r * 1.05, r * 0.72, r * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Heart/Cone Strawberry body
        ctx.fillStyle = '#E63946';
        ctx.strokeStyle = '#1E1B18';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.6);
        ctx.bezierCurveTo(r * 1.1, -r * 0.6, r * 0.9, r * 0.3, 0, r * 1.1);
        ctx.bezierCurveTo(-r * 0.9, r * 0.3, -r * 1.1, -r * 0.6, 0, -r * 0.6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Golden seed dots
        ctx.fillStyle = '#FFD13B';
        const seeds = [
          { x: -r * 0.42, y: -r * 0.1 },
          { x: 0, y: -r * 0.2 },
          { x: r * 0.42, y: -r * 0.1 },
          { x: -r * 0.25, y: r * 0.25 },
          { x: r * 0.25, y: r * 0.25 },
          { x: 0, y: r * 0.55 },
        ];
        seeds.forEach((s) => {
          ctx.beginPath();
          ctx.ellipse(s.x, s.y, 0.9, 1.3, 0.2, 0, Math.PI * 2);
          ctx.fill();
        });

        // Juicy highlight
        ctx.fillStyle = '#FFFDF8';
        ctx.beginPath();
        ctx.ellipse(-r * 0.35, -r * 0.35, r * 0.25, r * 0.15, -0.4, 0, Math.PI * 2);
        ctx.fill();

        // 3-leaf calyx crown
        ctx.fillStyle = '#70A288';
        ctx.strokeStyle = '#1E1B18';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.5);
        ctx.lineTo(r * 0.65, -r * 0.85);
        ctx.lineTo(r * 0.15, -r * 0.65);
        ctx.lineTo(0, -r * 1.05);
        ctx.lineTo(-r * 0.15, -r * 0.65);
        ctx.lineTo(-r * 0.65, -r * 0.85);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (foodType === 'plum') {
        // 🫐/🍑 PLUM
        // Shadow
        ctx.fillStyle = '#1E1B18';
        ctx.beginPath();
        ctx.ellipse(1, r * 0.95, r * 0.75, r * 0.32, 0, 0, Math.PI * 2);
        ctx.fill();

        // Velvety Plum oval
        ctx.fillStyle = '#7209B7';
        ctx.strokeStyle = '#1E1B18';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.92, r, 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Plum cleft / crease line
        ctx.strokeStyle = '#3C096C';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(r * 0.12, 0, r * 0.78, 1.3 * Math.PI, 0.7 * Math.PI);
        ctx.stroke();

        // Velvety bloom highlight
        ctx.fillStyle = '#B5179E';
        ctx.beginPath();
        ctx.ellipse(-r * 0.3, -r * 0.3, r * 0.35, r * 0.2, -0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFDF8';
        ctx.beginPath();
        ctx.arc(-r * 0.35, -r * 0.35, r * 0.18, 0, Math.PI * 2);
        ctx.fill();

        // Stem & leaf
        ctx.fillStyle = '#70A288';
        ctx.strokeStyle = '#1E1B18';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.ellipse(r * 0.35, -r * 0.95, r * 0.45, r * 0.22, -0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = '#5C3D2E';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.85);
        ctx.lineTo(r * 0.05, -r * 1.15);
        ctx.stroke();
      } else {
        // 🍎 APPLE
        ctx.fillStyle = '#1E1B18';
        ctx.beginPath();
        ctx.ellipse(1, r * 0.9, r * 0.8, r * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#D90429';
        ctx.strokeStyle = '#1E1B18';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#FFFDF8';
        ctx.beginPath();
        ctx.arc(-r * 0.35, -r * 0.35, r * 0.32, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#5C3D2E';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.8);
        ctx.lineTo(r * 0.05, -r * 1.15);
        ctx.stroke();

        ctx.fillStyle = '#70A288';
        ctx.strokeStyle = '#1E1B18';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.ellipse(r * 0.35, -r * 0.95, r * 0.45, r * 0.22, -0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore();
    };

    // DRAW SOIL CREATURES: CENTIPEDE, SNAKE, SLUG, WORM (MODERN CRISP POP ART & ARCADE DESIGN)
    const drawSoilCreature = (
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
      hasPhaseShield = false,
      creatureType: SoilCreatureType = 'worm',
      callsignTag = '',
      frameCount = 0
    ) => {
      if (points.length < 2) return;

      ctx.save();
      const segmentCount = points.length;

      // 1. Draw outer deep dark comic contour for the whole creature
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = (creatureType === 'slug' ? baseThickness * 1.3 : baseThickness) + 6;
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();

      // 2. Draw glossy neon body fill
      ctx.beginPath();
      ctx.strokeStyle = hasPhaseShield ? '#00F5D4' : color;
      ctx.lineWidth = creatureType === 'slug' ? baseThickness * 1.3 : baseThickness;
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();

      // 3. CENTIPEDE SCURRYING ARTICULATED LEGS WITH NEON CLAWS
      if (creatureType === 'centipede') {
        for (let i = 1; i < segmentCount - 1; i += 2) {
          const pt = points[i];
          const prev = points[i - 1];
          const dx = prev.x - pt.x;
          const dy = prev.y - pt.y;
          const len = Math.hypot(dx, dy) || 1;
          const nx = -dy / len;
          const ny = dx / len;

          const progress = 1 - i / segmentCount;
          const segRadius = (baseThickness / 2) * (0.65 + progress * 0.45);
          const legOsc = Math.sin(frameCount * 0.45 + i * 0.85);
          const legLength = segRadius + 9;

          // Left Leg
          const lKneeX = pt.x + nx * (segRadius * 0.95) - (dx / len) * (legOsc * 3.5);
          const lKneeY = pt.y + ny * (segRadius * 0.95) - (dy / len) * (legOsc * 3.5);
          const lFootX = lKneeX + nx * legLength - (dx / len) * (legOsc * 4.5 + 2);
          const lFootY = lKneeY + ny * legLength - (dy / len) * (legOsc * 4.5 + 2);

          ctx.strokeStyle = '#111111';
          ctx.lineWidth = 2.6;
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(lKneeX, lKneeY);
          ctx.lineTo(lFootX, lFootY);
          ctx.stroke();

          // Left claw accent tip (glowing neon)
          ctx.fillStyle = coreColor || '#B4F000';
          ctx.beginPath();
          ctx.arc(lFootX, lFootY, 2.2, 0, Math.PI * 2);
          ctx.fill();

          // Right Leg (opposite phase)
          const rKneeX = pt.x - nx * (segRadius * 0.95) + (dx / len) * (legOsc * 3.5);
          const rKneeY = pt.y - ny * (segRadius * 0.95) + (dy / len) * (legOsc * 3.5);
          const rFootX = rKneeX - nx * legLength + (dx / len) * (legOsc * 4.5 - 2);
          const rFootY = rKneeY - ny * legLength + (dy / len) * (legOsc * 4.5 - 2);

          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(rKneeX, rKneeY);
          ctx.lineTo(rFootX, rFootY);
          ctx.stroke();

          // Right claw accent tip
          ctx.beginPath();
          ctx.arc(rFootX, rFootY, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 4. Individual 3D Pop Segments & Pattern Accents
      for (let i = segmentCount - 1; i >= 0; i--) {
        const pt = points[i];
        const progress = 1 - i / segmentCount;
        const widthMult = creatureType === 'slug' ? 0.8 : 0.6;
        const segRadius = (baseThickness / 2) * (widthMult + progress * 0.45);

        // Segment circle + crisp ink border
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 2.4;
        ctx.fillStyle = i % 2 === 0 ? color : (coreColor || '#FFFFFF');
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, segRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Modern 3D gloss specular spot on top of each node
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.arc(pt.x - segRadius * 0.3, pt.y - segRadius * 0.3, Math.max(1.2, segRadius * 0.32), 0, Math.PI * 2);
        ctx.fill();

        if (creatureType === 'snake') {
          // Modern Snake Neon Diamond Spine
          if (i % 2 === 1) {
            ctx.fillStyle = coreColor || '#00F5D4';
            ctx.strokeStyle = '#111111';
            ctx.lineWidth = 1.6;
            const diaR = segRadius * 0.72;
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y - diaR);
            ctx.lineTo(pt.x + diaR * 0.75, pt.y);
            ctx.lineTo(pt.x, pt.y + diaR);
            ctx.lineTo(pt.x - diaR * 0.75, pt.y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Diamond inner gleam
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, Math.max(1, diaR * 0.25), 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (creatureType === 'slug') {
          // Slug soft bioluminescent mantle spot
          if (i % 3 === 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.beginPath();
            ctx.ellipse(pt.x, pt.y, segRadius * 0.55, segRadius * 0.32, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (creatureType === 'centipede') {
          // Centipede armored ridge plate
          ctx.strokeStyle = '#111111';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, segRadius * 0.82, -0.65 * Math.PI, 0.65 * Math.PI);
          ctx.stroke();
        } else {
          // Worm Belly ribbed spot
          if (i % 3 === 0) {
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(pt.x - 1, pt.y - 1, Math.max(1.2, segRadius * 0.36), 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 5. Centipede Streamers / Tail Cerci
      if (creatureType === 'centipede' && segmentCount > 2) {
        const lastPt = points[segmentCount - 1];
        const prevPt = points[segmentCount - 2];
        const tdx = lastPt.x - prevPt.x;
        const tdy = lastPt.y - prevPt.y;
        const tlen = Math.hypot(tdx, tdy) || 1;
        const tDirX = tdx / tlen;
        const tDirY = tdy / tlen;
        const tNormX = -tDirY;
        const tNormY = tDirX;

        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        // Left cercus
        ctx.moveTo(lastPt.x, lastPt.y);
        ctx.quadraticCurveTo(
          lastPt.x + tNormX * 7 + tDirX * 9,
          lastPt.y + tNormY * 7 + tDirY * 9,
          lastPt.x + tNormX * 14 + tDirX * 18,
          lastPt.y + tNormY * 14 + tDirY * 18
        );
        // Right cercus
        ctx.moveTo(lastPt.x, lastPt.y);
        ctx.quadraticCurveTo(
          lastPt.x - tNormX * 7 + tDirX * 9,
          lastPt.y - tNormY * 7 + tDirY * 9,
          lastPt.x - tNormX * 14 + tDirX * 18,
          lastPt.y - tNormY * 14 + tDirY * 18
        );
        ctx.stroke();

        // Glowing tips
        ctx.fillStyle = coreColor || '#B4F000';
        ctx.beginPath();
        ctx.arc(lastPt.x + tNormX * 14 + tDirX * 18, lastPt.y + tNormY * 14 + tDirY * 18, 2.5, 0, Math.PI * 2);
        ctx.arc(lastPt.x - tNormX * 14 + tDirX * 18, lastPt.y - tNormY * 14 + tDirY * 18, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 6. Expressive Modern Head (Per Creature Type)
      ctx.save();
      ctx.translate(headX, headY);
      ctx.rotate(angle + Math.PI / 2);

      const headRadius = baseThickness * (creatureType === 'slug' ? 1.3 : 1.1);

      if (creatureType === 'centipede') {
        // --- MODERN CENTIPEDE HEAD ---
        // Mandibles at front
        ctx.strokeStyle = '#111111';
        ctx.fillStyle = '#111111';
        ctx.lineWidth = 2.8;
        // Left pincer
        ctx.beginPath();
        ctx.moveTo(-headRadius * 0.4, -headRadius * 0.4);
        ctx.quadraticCurveTo(-headRadius * 1.15, -headRadius * 1.25, -headRadius * 0.1, -headRadius * 1.25);
        ctx.stroke();
        // Right pincer
        ctx.beginPath();
        ctx.moveTo(headRadius * 0.4, -headRadius * 0.4);
        ctx.quadraticCurveTo(headRadius * 1.15, -headRadius * 1.25, headRadius * 0.1, -headRadius * 1.25);
        ctx.stroke();

        // Twitching curved antennae with neon glowing spheres
        const antOsc = Math.sin(frameCount * 0.25) * 5.5;
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        // Left antenna
        ctx.moveTo(-headRadius * 0.5, -headRadius * 0.6);
        ctx.quadraticCurveTo(-headRadius * 1.3 + antOsc, -headRadius * 1.6, -headRadius * 1.65 + antOsc * 1.5, -headRadius * 2.3);
        // Right antenna
        ctx.moveTo(headRadius * 0.5, -headRadius * 0.6);
        ctx.quadraticCurveTo(headRadius * 1.3 - antOsc, -headRadius * 1.6, headRadius * 1.65 - antOsc * 1.5, -headRadius * 2.3);
        ctx.stroke();

        // Antenna glowing tips
        ctx.fillStyle = coreColor || '#B4F000';
        ctx.beginPath();
        ctx.arc(-headRadius * 1.65 + antOsc * 1.5, -headRadius * 2.3, 3, 0, Math.PI * 2);
        ctx.arc(headRadius * 1.65 - antOsc * 1.5, -headRadius * 2.3, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Armored head plate
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 3.6;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(0, 0, headRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Forehead armor brow
        ctx.fillStyle = coreColor || '#FF9E00';
        ctx.beginPath();
        ctx.arc(0, -headRadius * 0.22, headRadius * 0.62, 0, Math.PI);
        ctx.fill();
        ctx.stroke();

        // Big Cyber/Predator Eyes
        const eyeOffset = headRadius * 0.55;
        [-eyeOffset, eyeOffset].forEach((ex) => {
          ctx.fillStyle = '#111111';
          ctx.beginPath();
          ctx.arc(ex, -headRadius * 0.25, headRadius * 0.34, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = coreColor || '#B4F000';
          ctx.beginPath();
          ctx.arc(ex - 1, -headRadius * 0.3, 2.2, 0, Math.PI * 2);
          ctx.arc(ex + 1, -headRadius * 0.2, 1.4, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (creatureType === 'snake') {
        // --- MODERN SNAKE HEAD (Aggressive Angular Viper + Forked Tongue) ---
        const tongueWiggle = Math.sin(frameCount * 0.35) * 3.5;
        ctx.strokeStyle = '#FF0055';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(0, -headRadius * 0.95);
        ctx.lineTo(tongueWiggle, -headRadius * 1.85);
        // Fork left
        ctx.lineTo(tongueWiggle - 4.5, -headRadius * 2.3);
        ctx.moveTo(tongueWiggle, -headRadius * 1.85);
        // Fork right
        ctx.lineTo(tongueWiggle + 4.5, -headRadius * 2.3);
        ctx.stroke();

        // Sharp Viper Head
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 3.6;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, -headRadius * 1.25); // snout
        ctx.lineTo(headRadius * 1.05, -headRadius * 0.1); // right jaw
        ctx.lineTo(headRadius * 0.75, headRadius * 0.75); // right back
        ctx.lineTo(-headRadius * 0.75, headRadius * 0.75); // left back
        ctx.lineTo(-headRadius * 1.05, -headRadius * 0.1); // left jaw
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Forehead Diamond Scale
        ctx.fillStyle = coreColor || '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(0, -headRadius * 0.65);
        ctx.lineTo(headRadius * 0.4, 0);
        ctx.lineTo(0, headRadius * 0.5);
        ctx.lineTo(-headRadius * 0.4, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Gloss highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.arc(-headRadius * 0.3, -headRadius * 0.5, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Glowing Cat/Viper Slit Eyes
        const eyeOffset = headRadius * 0.58;
        [-eyeOffset, eyeOffset].forEach((ex) => {
          ctx.fillStyle = coreColor || '#B4F000';
          ctx.strokeStyle = '#111111';
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.ellipse(ex, -headRadius * 0.16, headRadius * 0.32, headRadius * 0.24, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Fierce Slit pupil
          ctx.fillStyle = '#111111';
          ctx.beginPath();
          ctx.ellipse(ex, -headRadius * 0.16, 1.4, headRadius * 0.2, 0, 0, Math.PI * 2);
          ctx.fill();

          // Gleam
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(ex - 1.2, -headRadius * 0.22, 1.2, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (creatureType === 'slug') {
        // --- MODERN SLUG HEAD (Chubby Bio-luminescent face + Eye stalks) ---
        const stalkWobble = Math.sin(frameCount * 0.14) * 2.2;
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 3.4;
        ctx.fillStyle = color;

        // Left eye stalk
        ctx.beginPath();
        ctx.moveTo(-headRadius * 0.4, -headRadius * 0.3);
        ctx.quadraticCurveTo(-headRadius * 0.75, -headRadius * 1.15 + stalkWobble, -headRadius * 0.65 + stalkWobble, -headRadius * 1.8);
        ctx.stroke();

        // Right eye stalk
        ctx.beginPath();
        ctx.moveTo(headRadius * 0.4, -headRadius * 0.3);
        ctx.quadraticCurveTo(headRadius * 0.75, -headRadius * 1.15 - stalkWobble, headRadius * 0.65 - stalkWobble, -headRadius * 1.8);
        ctx.stroke();

        // Left eyeball at stalk tip
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 2.2;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(-headRadius * 0.65 + stalkWobble, -headRadius * 1.8, 4.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#111111';
        ctx.beginPath();
        ctx.arc(-headRadius * 0.65 + stalkWobble, -headRadius * 1.8 - 0.8, 2.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(-headRadius * 0.65 + stalkWobble - 1, -headRadius * 1.8 - 1.6, 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Right eyeball at stalk tip
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(headRadius * 0.65 - stalkWobble, -headRadius * 1.8, 4.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#111111';
        ctx.beginPath();
        ctx.arc(headRadius * 0.65 - stalkWobble, -headRadius * 1.8 - 0.8, 2.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(headRadius * 0.65 - stalkWobble - 1, -headRadius * 1.8 - 1.6, 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Chubby rounded slug head
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 3.6;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(0, 0, headRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Specular glow
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.ellipse(0, -headRadius * 0.35, headRadius * 0.4, headRadius * 0.22, 0, 0, Math.PI * 2);
        ctx.fill();

        // Mouth
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(0, headRadius * 0.25, headRadius * 0.25, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.stroke();

        // Lower tentacles
        ctx.fillStyle = coreColor || '#00F5D4';
        ctx.beginPath();
        ctx.arc(-headRadius * 0.52, headRadius * 0.36, 2.8, 0, Math.PI * 2);
        ctx.arc(headRadius * 0.52, headRadius * 0.36, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else {
        // --- MODERN ENERGETIC WORM HEAD ---
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 3.6;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(0, 0, headRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Crisp 3D Forehead highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(0, -headRadius * 0.36, headRadius * 0.48, 0, Math.PI * 2);
        ctx.fill();

        // Rosy Cheeks
        ctx.fillStyle = '#FF0055';
        ctx.beginPath();
        ctx.arc(-headRadius * 0.65, 0.5, headRadius * 0.22, 0, Math.PI * 2);
        ctx.arc(headRadius * 0.65, 0.5, headRadius * 0.22, 0, Math.PI * 2);
        ctx.fill();

        // Expressive Googly Eyes
        const eyeOffsetX = headRadius * 0.42;
        const eyeOffsetY = -headRadius * 0.28;
        const eyeRadius = headRadius * 0.36;
        const pupilRadius = eyeRadius * 0.54;

        [-eyeOffsetX, eyeOffsetX].forEach((ex) => {
          ctx.strokeStyle = '#111111';
          ctx.lineWidth = 2.6;
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(ex, eyeOffsetY, eyeRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#111111';
          ctx.beginPath();
          ctx.arc(ex, eyeOffsetY - 1.2, pupilRadius, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(ex - 1.2, eyeOffsetY - 2.4, pupilRadius * 0.45, 0, Math.PI * 2);
          ctx.fill();
        });

        // Dynamic Smiling Mouth
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.arc(0, headRadius * 0.2, headRadius * 0.38, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.stroke();

        // Tongue sticking out for player
        if (isPlayer) {
          ctx.fillStyle = '#FF0055';
          ctx.beginPath();
          ctx.arc(0, headRadius * 0.5, headRadius * 0.18, 0, Math.PI);
          ctx.fill();
          ctx.stroke();
        }
      }

      // Bubble Shield Aura
      if (hasPhaseShield) {
        ctx.strokeStyle = '#00F5D4';
        ctx.lineWidth = 3.6;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(0, 0, headRadius * 1.7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.restore();

      // Boost exhaust
      if (boosting && frameCount % 3 === 0) {
        emitSparks(headX - Math.cos(angle) * 14, headY - Math.sin(angle) * 14, '#FFFDF8', 2, 2.0);
      }

      // Modern Pop Badge & Callsign Tag above head
      const label = isPlayer ? callsignTag || 'WOBBLY_JOE' : callsignTag || color;
      ctx.save();
      ctx.font = '900 12px "Bangers", cursive, sans-serif';
      const textMetrics = ctx.measureText(label);
      const tagWidth = textMetrics.width + 12;
      const tagHeight = 16;
      const tagX = headX - tagWidth / 2;
      const tagY = headY - headRadius - 20;

      // Small badge container
      ctx.fillStyle = isPlayer ? '#B4F000' : 'rgba(255, 255, 255, 0.92)';
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(tagX, tagY, tagWidth, tagHeight, 6);
      ctx.fill();
      ctx.stroke();

      // Text with drop shadow
      ctx.fillStyle = '#111111';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, headX, tagY + tagHeight / 2 + 1);
      ctx.restore();

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

        // Boost costs length and mass unless overclock is on
        if (boostActive && !hasOverclock) {
          const diffSetting = difficultyRef.current;
          const scoreBurnRate = diffSetting === 'hard' ? 0.45 : diffSetting === 'medium' ? 0.25 : 0.12;
          localScore = Math.max(10, localScore - scoreBurnRate);

          if (frame % 4 === 0) {
            emitSparks(player.x, player.y, player.color, 2, 1.2);
          }

          // In hard or medium mode, sustained boosting sheds fruit mass behind the player
          if (frame % 18 === 0 && player.maxTrail > 24) {
            player.maxTrail = Math.max(22, player.maxTrail - 1);
            if (orbs.length < 500) {
              const dropFruit: FoodType = Math.random() < 0.5 ? 'strawberry' : 'orange';
              orbs.push({
                x: player.x - Math.cos(player.angle) * (player.thickness + 12),
                y: player.y - Math.sin(player.angle) * (player.thickness + 12),
                radius: 4.5,
                color: dropFruit === 'strawberry' ? '#E63946' : '#FA824C',
                pulse: Math.random() * Math.PI * 2,
                vx: -Math.cos(player.angle) * 1.5 + (Math.random() - 0.5),
                vy: -Math.sin(player.angle) * 1.5 + (Math.random() - 0.5),
                value: 25,
                isLoot: true,
                foodType: dropFruit,
              });
            }
          }
        }
      }

      // Camera Follow Smooth
      camera.x += (player.x - width / 2 - camera.x) * 0.1;
      camera.y += (player.y - height / 2 - camera.y) * 0.1;

      // Clear & Pre-render Transform
      ctx.save();
      ctx.fillStyle = '#FFF8ED';
      ctx.fillRect(0, 0, width, height);

      const shakeX = (Math.random() - 0.5) * screenShake;
      const shakeY = (Math.random() - 0.5) * screenShake;
      ctx.translate(-camera.x + shakeX, -camera.y + shakeY);

      // Draw Retro Cartoon Meadow Grid
      drawGrid();

      // Draw Retro Cartoon Arena Boundary
      ctx.save();
      ctx.strokeStyle = '#1E1B18';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(ARENA_CENTER_X, ARENA_CENTER_Y, ARENA_RADIUS, 0, Math.PI * 2);
      ctx.stroke();

      // Comic hazard ring
      ctx.strokeStyle = '#FA824C';
      ctx.lineWidth = 4;
      ctx.setLineDash([12, 10]);
      ctx.beginPath();
      ctx.arc(ARENA_CENTER_X, ARENA_CENTER_Y, ARENA_RADIUS - 12, 0, Math.PI * 2);
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

        // Draw Cartoon Soil Fruits (Oranges, Strawberries, Plums, Apples)
        const r = Math.max(3.5, orb.radius + Math.sin(orb.pulse) * 0.6);
        drawFruit(orb.x, orb.y, r, orb.foodType, orb.pulse);

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

            // Comic 'POW!' or 'ZAP!' animation burst on apple chomp
            const burstWord: 'POW!' | 'ZAP!' = Math.random() > 0.5 ? 'POW!' : 'ZAP!';
            const burstBg = burstWord === 'POW!' ? '#FFD13B' : '#78C0E0';
            const burstText = '#1E1B18';

            // 1. In-World Canvas Action Starburst (very small)
            comicBursts.push({
              x: orb.x,
              y: orb.y,
              text: burstWord,
              color: burstBg,
              textColor: burstText,
              life: 1.0,
              decay: 0.042,
              rotation: (Math.random() - 0.5) * 0.35,
              points: 10,
              innerR: 6,
              outerR: 13,
            });

            // 2. Crisp comic sound snap
            sounds.playPowZapSound(burstWord === 'POW!' ? 'pow' : 'zap');

            // 3. Viewport Screen Animation Overlay
            const screenX = Math.max(65, Math.min(width - 65, orb.x - camera.x));
            const screenY = Math.max(65, Math.min(height - 65, orb.y - camera.y));
            triggerChompOverlay(burstWord, burstBg, burstText, screenX, screenY);

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
      const currentDifficulty = difficultyRef.current;
      const huntingChance = currentDifficulty === 'hard' ? 0.75 : currentDifficulty === 'medium' ? 0.45 : 0.20;
      const botSpeedMult = currentDifficulty === 'hard' ? 1.25 : currentDifficulty === 'medium' ? 1.05 : 0.88;

      bots.forEach((bot, bIdx) => {
        if (isPausedRef.current) return;

        // Dynamic tactical AI: Centipedes and Snakes actively calculate intercept vectors
        const distToPlayer = Math.hypot(player.x - bot.x, player.y - bot.y);
        const isDangerousHunter = bot.creatureType === 'centipede' || bot.creatureType === 'snake' || bot.isFastPasser;

        // Check if bot should trigger a tactical boost to cut off the player
        if (isDangerousHunter && distToPlayer < 420 && Math.random() < huntingChance * 0.04) {
          bot.isBotBoosting = true;
          bot.boostTimer = Math.floor(Math.random() * 45 + 30);
        }

        if (bot.boostTimer && bot.boostTimer > 0) {
          bot.boostTimer--;
          if (bot.boostTimer <= 0) bot.isBotBoosting = false;
        }

        const effectiveSpeed = (bot.speed * botSpeedMult) * (bot.isBotBoosting ? 1.45 : 1.0);

        if ((bot.isFastPasser || bot.isBotBoosting) && frame % 2 === 0) {
          emitSparks(bot.x, bot.y, bot.isBotBoosting ? '#FFD13B' : '#ff0055', 2, 2.0);
        }

        let targetAngle = bot.angle;
        let hasTarget = false;

        // TACTICAL 1: Intercept & Cut Off Player Path
        if (isDangerousHunter && distToPlayer < (currentDifficulty === 'hard' ? 520 : 360) && !hasPhase) {
          // Calculate where the player will be in 25-45 frames
          const leadFrames = currentDifficulty === 'hard' ? 32 : 20;
          const futurePlayerX = player.x + Math.cos(player.angle) * (boostActive ? 8.5 : 4.5) * leadFrames;
          const futurePlayerY = player.y + Math.sin(player.angle) * (boostActive ? 8.5 : 4.5) * leadFrames;

          targetAngle = Math.atan2(futurePlayerY - bot.y, futurePlayerX - bot.x);
          hasTarget = true;
          bot.isHunting = true;
        } else {
          bot.isHunting = false;
        }

        // TACTICAL 2: Avoid crashing into other bots' trails or arena wall
        const distToWall = ARENA_RADIUS - Math.hypot(bot.x - ARENA_CENTER_X, bot.y - ARENA_CENTER_Y);
        if (distToWall < 90) {
          // Steer inward toward center
          targetAngle = Math.atan2(ARENA_CENTER_Y - bot.y, ARENA_CENTER_X - bot.x);
          hasTarget = true;
        }

        // TACTICAL 3: Hunt orbs if not in aggressive combat
        if (!hasTarget) {
          let closestOrb: Orb | null = null;
          let closestOrbIdx = -1;
          let minDist = 260;

          // If the bot has been circling the same fruit for too long, break orbit and find another or cruise forward
          if (bot.circleCounter && bot.circleCounter > 40) {
            bot.circleCounter--;
            // Cruise in straight or slight wander direction to disengage orbit
            bot.angle += (Math.random() - 0.5) * 0.04;
          } else {
            for (let i = 0; i < orbs.length; i++) {
              if (bot.lastTargetOrbId === i && (bot.circleCounter || 0) > 30) continue;
              const d = Math.hypot(orbs[i].x - bot.x, orbs[i].y - bot.y);
              if (d < minDist) {
                minDist = d;
                closestOrb = orbs[i];
                closestOrbIdx = i;
              }
            }

            if (closestOrb) {
              const dToOrb = minDist;
              const angleToOrb = Math.atan2(closestOrb.y - bot.y, closestOrb.x - bot.x);

              let diff = angleToOrb - bot.angle;
              while (diff < -Math.PI) diff += Math.PI * 2;
              while (diff > Math.PI) diff -= Math.PI * 2;

              // Check if bot is close and turning in circles around it
              if (dToOrb < 75 && Math.abs(diff) > 1.2) {
                bot.circleCounter = (bot.circleCounter || 0) + 1;
                bot.lastTargetOrbId = closestOrbIdx;
              } else if (dToOrb > 100) {
                bot.circleCounter = Math.max(0, (bot.circleCounter || 0) - 2);
              }

              // When close to fruit, snap turning rate or overshoot slightly so it never circles endlessly
              if (dToOrb < 60) {
                // Direct aggressive snap directly through the fruit center
                targetAngle = angleToOrb;
                hasTarget = true;
                // Boost turning authority at close proximity to ensure interception
                const closeSnapTurn = Math.min(1.0, (bot.turnRate || 0.05) * 3.8);
                bot.angle += diff * closeSnapTurn;
              } else {
                targetAngle = angleToOrb;
                hasTarget = true;
                const aggressiveTurn = bot.turnRate * (currentDifficulty === 'hard' ? 1.4 : 1.2);
                bot.angle += diff * aggressiveTurn;
              }
            }
          }
        } else {
          // Has wall or player target
          let diff = targetAngle - bot.angle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          const aggressiveTurn = bot.turnRate * (currentDifficulty === 'hard' ? 1.35 : 1.1);
          bot.angle += diff * aggressiveTurn;
        }

        if (!hasTarget && (!bot.circleCounter || bot.circleCounter <= 0)) {
          bot.angle += (Math.random() - 0.5) * (bot.isFastPasser ? 0.03 : 0.08);
        }

        bot.x += Math.cos(bot.angle) * effectiveSpeed;
        bot.y += Math.sin(bot.angle) * effectiveSpeed;

        const botDist = Math.hypot(bot.x - ARENA_CENTER_X, bot.y - ARENA_CENTER_Y);
        if (botDist >= ARENA_RADIUS - 15) {
          bots[bIdx] = createSingleBot(bIdx);
        }

        bot.trail.unshift({ x: bot.x, y: bot.y });
        if (bot.trail.length > bot.maxTrail) bot.trail.pop();

        // Bot eats orbs and GROWS! (Competitive dynamic arena)
        // Generous fruit vacuum radius for bots to smoothly collect fruit without misses
        const botChompRadius = bot.thickness + 18;
        for (let i = orbs.length - 1; i >= 0; i--) {
          const d = Math.hypot(orbs[i].x - bot.x, orbs[i].y - bot.y);
          if (d < botChompRadius + orbs[i].radius) {
            emitSparks(orbs[i].x, orbs[i].y, bot.color, 6, 1.1);
            bot.circleCounter = 0;
            bot.lastTargetOrbId = -1;

            // Bot grows in segments and score!
            const orbVal = orbs[i].value || 45;
            bot.score = (bot.score || 0) + orbVal;
            bot.fruitsEaten = (bot.fruitsEaten || 0) + 1;
            bot.maxTrail = Math.min(180, bot.maxTrail + (orbs[i].isLoot ? 2 : 1));

            // Increase thickness slightly as they eat more fruit (up to 18px)
            if (bot.fruitsEaten % 6 === 0 && bot.thickness < 18) {
              bot.thickness += 0.5;
              // Visual grow burst popup above bot
              addScorePopup(bot.x, bot.y - 18, `GROW!`, bot.color, 0.9);
            }

            if (orbs[i].isLoot) {
              orbs.splice(i, 1);
            } else {
              orbs[i] = createOrb();
            }
          }
        }

        // --- COMPREHENSIVE COMBAT & ACCURATE COLLISION DETECTION ---
        const playerHeadR = player.thickness * 1.15 + 3;
        const botHeadR = bot.thickness * (bot.creatureType === 'slug' ? 1.3 : 1.15) + 3;
        const playerBodyR = player.thickness * 0.55 + 3;
        const botBodyR = bot.thickness * 0.55 + 3;

        // 1. DIRECT HEAD-TO-HEAD TOUCH (Player Head & Bot Head)
        const headToHeadDist = Math.hypot(player.x - bot.x, player.y - bot.y);
        const headToHeadThreshold = playerHeadR + botHeadR + 4;

        if (headToHeadDist < headToHeadThreshold) {
          // Direct Head-on collision occurred!
          if (hasPhase) {
            // Player Phase Shield shatters the bot
            localKills += 1;
            currentCombo += 1;
            comboTimer = 260;
            setComboCount(currentCombo);
            const award = (bot.isFastPasser ? 1200 : 600) + currentCombo * 180;
            localScore += award;
            screenShake = 18;
            emitSparks(bot.x, bot.y, '#00F5D4', 50, 4.0);
            addScorePopup(bot.x, bot.y - 20, `PHASE DEFLECT! +${award}`, '#00F5D4', 1.3);
            sounds.playShatter();
            dropLootOrbs(bot.x, bot.y, bot.score || 500);
            setAlertText(`${bot.name} SHATTERED BY SHIELD!`);
            setAlertColor('#00F5D4');
            setTimeout(() => setAlertText('ARENA LIVE'), 2600);
            setKills(localKills);
            setScore(Math.floor(localScore));
            setBestToday((prev) => Math.max(prev, Math.floor(localScore)));
            if (onKillsUpdate) onKillsUpdate(localKills);
            if (onScoreUpdate) onScoreUpdate(Math.floor(localScore));
            bots[bIdx] = createSingleBot(bIdx);
            return;
          } else if (isBoosting || mobileInput.boost) {
            // Player was boosting: Player ram overpowers bot!
            localKills += 1;
            currentCombo += 1;
            comboTimer = 260;
            setComboCount(currentCombo);
            const award = (bot.isFastPasser ? 1400 : 700) + currentCombo * 200;
            localScore += award;
            screenShake = 20;
            emitSparks(bot.x, bot.y, bot.color, 55, 4.2);
            addScorePopup(bot.x, bot.y - 20, `HEAD-ON RAM! +${award}`, '#B4F000', 1.4);
            sounds.playShatter();
            dropLootOrbs(bot.x, bot.y, bot.score || 500);
            setAlertText(`HEAD-ON TAKEDOWN: ${bot.name}`);
            setAlertColor('#B4F000');
            setTimeout(() => setAlertText('ARENA LIVE'), 2600);
            setKills(localKills);
            setScore(Math.floor(localScore));
            setBestToday((prev) => Math.max(prev, Math.floor(localScore)));
            if (onKillsUpdate) onKillsUpdate(localKills);
            if (onScoreUpdate) onScoreUpdate(Math.floor(localScore));
            bots[bIdx] = createSingleBot(bIdx);
            return;
          } else if (bot.isBotBoosting && (bot.score || 0) > localScore * 1.2) {
            // Bot was boosting and significantly larger: Eliminates player
            screenShake = 20;
            emitSparks(player.x, player.y, player.color, 45, 3.5);
            addScorePopup(player.x, player.y - 20, `RAMMED HEAD-ON BY ${bot.name}`, '#ff007f');
            sounds.playShatter();
            dropLootOrbs(player.x, player.y, localScore);
            setAlertText(`RAMMED HEAD-ON BY ${bot.name}`);
            setAlertColor('#ff007f');
            setTimeout(() => setAlertText('ARENA LIVE'), 2600);
            bot.score = (bot.score || 0) + 500;
            bot.maxTrail = Math.min(180, bot.maxTrail + 12);
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
            return;
          } else if (localScore >= (bot.score || 0)) {
            // Player is larger or equal in mass: Player wins head-on clash!
            localKills += 1;
            currentCombo += 1;
            comboTimer = 260;
            setComboCount(currentCombo);
            const award = (bot.isFastPasser ? 1200 : 500) + currentCombo * 180;
            localScore += award;
            screenShake = 16;
            emitSparks(bot.x, bot.y, bot.color, 50, 4.0);
            addScorePopup(bot.x, bot.y - 20, `HEAD-ON CLASH WIN! +${award}`, '#FF9E00', 1.3);
            sounds.playShatter();
            dropLootOrbs(bot.x, bot.y, bot.score || 450);
            setAlertText(`${bot.name} ELIMINATED`);
            setAlertColor('#ff007f');
            setTimeout(() => setAlertText('ARENA LIVE'), 2600);
            setKills(localKills);
            setScore(Math.floor(localScore));
            setBestToday((prev) => Math.max(prev, Math.floor(localScore)));
            if (onKillsUpdate) onKillsUpdate(localKills);
            if (onScoreUpdate) onScoreUpdate(Math.floor(localScore));
            bots[bIdx] = createSingleBot(bIdx);
            return;
          } else {
            // Bot is larger: Eliminates player
            screenShake = 18;
            emitSparks(player.x, player.y, player.color, 45, 3.5);
            addScorePopup(player.x, player.y - 20, `HEAD-ON CLASH WITH ${bot.name}`, '#ff007f');
            sounds.playShatter();
            dropLootOrbs(player.x, player.y, localScore);
            setAlertText(`KILLED BY ${bot.name}`);
            setAlertColor('#ff007f');
            setTimeout(() => setAlertText('ARENA LIVE'), 2600);
            bot.score = (bot.score || 0) + 500;
            bot.maxTrail = Math.min(180, bot.maxTrail + 12);
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
            return;
          }
        }

        // 2. BOT HEAD HITS PLAYER BODY (Player Victory - Bot Cut by Player Trail)
        // Checks from segment 1 onwards with realistic touching radius
        const botCutThreshold = botHeadR + playerBodyR + 3;
        for (let t = 1; t < player.trail.length; t++) {
          const td = Math.hypot(player.trail[t].x - bot.x, player.trail[t].y - bot.y);
          if (td < botCutThreshold) {
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
            return;
          }
        }

        // 3. BOT CUTS OTHER BOTS (Bot-to-Bot Head-to-Head & Trail Takedowns)
        for (let obIdx = 0; obIdx < bots.length; obIdx++) {
          if (obIdx === bIdx) continue;
          const otherBot = bots[obIdx];
          const otherHeadR = otherBot.thickness * (otherBot.creatureType === 'slug' ? 1.3 : 1.15) + 3;
          const otherBodyR = otherBot.thickness * 0.55 + 3;

          // A. Bot-to-Bot Head-to-Head Collision
          const b2bHeadDist = Math.hypot(bot.x - otherBot.x, bot.y - otherBot.y);
          if (b2bHeadDist < botHeadR + otherHeadR + 4) {
            // Lower score bot shatters
            if ((bot.score || 0) >= (otherBot.score || 0)) {
              emitSparks(otherBot.x, otherBot.y, otherBot.color, 30, 2.5);
              dropLootOrbs(otherBot.x, otherBot.y, Math.min(600, otherBot.score || 350));
              bot.score = (bot.score || 0) + 400;
              bot.maxTrail = Math.min(180, bot.maxTrail + 10);
              addScorePopup(bot.x, bot.y - 18, `+400 CHOMP!`, bot.color, 1.0);
              bots[obIdx] = createSingleBot(obIdx);
            } else {
              emitSparks(bot.x, bot.y, bot.color, 30, 2.5);
              dropLootOrbs(bot.x, bot.y, Math.min(600, bot.score || 350));
              otherBot.score = (otherBot.score || 0) + 400;
              otherBot.maxTrail = Math.min(180, otherBot.maxTrail + 10);
              addScorePopup(otherBot.x, otherBot.y - 18, `+400 CHOMP!`, otherBot.color, 1.0);
              bots[bIdx] = createSingleBot(bIdx);
              return;
            }
            break;
          }

          // B. Bot Head hit otherBot's body trail
          let hitOther = false;
          const b2bTrailThreshold = botHeadR + otherBodyR + 3;
          for (let ot = 1; ot < otherBot.trail.length; ot++) {
            const botBotDist = Math.hypot(otherBot.trail[ot].x - bot.x, otherBot.trail[ot].y - bot.y);
            if (botBotDist < b2bTrailThreshold) {
              // bot ran into otherBot's body!
              emitSparks(bot.x, bot.y, bot.color, 30, 2.5);
              dropLootOrbs(bot.x, bot.y, Math.min(600, bot.score || 350));
              otherBot.score = (otherBot.score || 0) + 400;
              otherBot.maxTrail = Math.min(180, otherBot.maxTrail + 10);
              addScorePopup(otherBot.x, otherBot.y - 18, `+400 CHOMP!`, otherBot.color, 1.0);
              bots[bIdx] = createSingleBot(bIdx);
              hitOther = true;
              return;
            }
          }
          if (hitOther) break;
        }

        // 4. PLAYER HEAD HITS BOT BODY (Bot Victory - Player Cut by Bot Trail)
        if (!hasPhase) {
          const playerCutThreshold = playerHeadR + botBodyR + 3;
          for (let t = 1; t < bot.trail.length; t++) {
            const pd = Math.hypot(bot.trail[t].x - player.x, bot.trail[t].y - player.y);
            if (pd < playerCutThreshold) {
              screenShake = 18;
              emitSparks(player.x, player.y, player.color, 45, 3.5);
              addScorePopup(player.x, player.y - 20, `ELIMINATED BY ${bot.name}`, '#ff007f');
              sounds.playShatter();

              dropLootOrbs(player.x, player.y, localScore);

              setAlertText(`KILLED BY ${bot.name}`);
              setAlertColor('#ff007f');
              setTimeout(() => setAlertText('ARENA LIVE'), 2600);

              bot.score = (bot.score || 0) + 500;
              bot.maxTrail = Math.min(180, bot.maxTrail + 12);
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
              return;
            }
          }
        }
      });

      // DRAW BOT SOIL CREATURES (Centipedes, Snakes, Slugs, Worms)
      bots.forEach((bot) => {
        drawSoilCreature(
          bot.trail,
          bot.x,
          bot.y,
          bot.angle,
          bot.color,
          bot.coreColor,
          bot.eyeColor,
          bot.thickness,
          false,
          bot.isFastPasser || false,
          false,
          bot.creatureType,
          bot.name,
          frame
        );
      });

      // DRAW PLAYER WORM
      drawSoilCreature(
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
        hasPhase,
        'worm',
        callsign || 'WOBBLY_JOE',
        frame
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

      // COMIC ACTION BURSTS ('POW!' / 'ZAP!')
      for (let i = comicBursts.length - 1; i >= 0; i--) {
        const cb = comicBursts[i];
        cb.life -= cb.decay;
        if (cb.life <= 0) {
          comicBursts.splice(i, 1);
          continue;
        }

        const progress = 1 - cb.life;
        let scale = 1.0;
        if (progress < 0.25) {
          scale = 0.4 + (progress / 0.25) * 0.65;
        } else if (progress < 0.45) {
          scale = 1.05 - ((progress - 0.25) / 0.2) * 0.05;
        } else {
          scale = 1.0 - (progress - 0.45) * 0.18;
        }

        cb.y -= 0.65; // gentle upward float

        ctx.save();
        ctx.translate(cb.x, cb.y);
        ctx.rotate(cb.rotation);
        ctx.scale(scale, scale);
        ctx.globalAlpha = Math.min(1.0, cb.life * 1.5);

        // 1. Comic hard black drop shadow (subtle, small)
        ctx.save();
        ctx.translate(1.5, 1.5);
        ctx.fillStyle = '#1E1B18';
        drawBurstPolygon(ctx, 0, 0, cb.points, cb.outerR, cb.innerR);
        ctx.fill();
        ctx.restore();

        // 2. Starburst body fill + clean ink outline
        ctx.fillStyle = cb.color;
        ctx.strokeStyle = '#1E1B18';
        ctx.lineWidth = 1.8;
        ctx.lineJoin = 'miter';
        drawBurstPolygon(ctx, 0, 0, cb.points, cb.outerR, cb.innerR);
        ctx.fill();
        ctx.stroke();

        // 3. Inner decorative highlight rim
        ctx.strokeStyle = '#FFFDF8';
        ctx.lineWidth = 0.9;
        drawBurstPolygon(ctx, 0, 0, cb.points, cb.outerR * 0.72, cb.innerR * 0.72);
        ctx.stroke();

        // 4. Action Text: 'POW!' or 'ZAP!' (very small)
        ctx.font = '900 9px "Bangers", cursive, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Ink outline
        ctx.strokeStyle = '#1E1B18';
        ctx.lineWidth = 2.0;
        ctx.strokeText(cb.text, 0, 0.5);

        // Text fill
        ctx.fillStyle = cb.textColor;
        ctx.fillText(cb.text, 0, 0.5);

        // 5. Comic Speed/Action Rays (tiny)
        ctx.strokeStyle = '#1E1B18';
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';
        for (let s = 0; s < 4; s++) {
          const rayAngle = (s * Math.PI) / 2 + 0.35;
          const r1 = cb.outerR + 1.5;
          const r2 = cb.outerR + 4.5;
          ctx.beginPath();
          ctx.moveTo(Math.cos(rayAngle) * r1, Math.sin(rayAngle) * r1);
          ctx.lineTo(Math.cos(rayAngle) * r2, Math.sin(rayAngle) * r2);
          ctx.stroke();
        }

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
      if (chompTimeoutRef.current) clearTimeout(chompTimeoutRef.current);
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
        relative rounded-xl bg-[#FFF8ED] border-3 border-[#1E1B18]
        shadow-[5px_5px_0px_#1E1B18]
        ${isFullscreen ? 'overflow-visible' : 'overflow-hidden'}
        flex flex-col justify-between p-4 select-none group/arena
        ${isFullscreen ? 'w-full h-full min-h-screen' : 'h-[min(78vh,620px)] min-h-[440px] sm:min-h-[500px] sm:h-[600px]'}
      `}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block cursor-crosshair z-0" />

      {/* COMIC 'POW!' / 'ZAP!' CHOMP ANIMATION OVERLAY (VERY SMALL) */}
      {chompOverlay && (
        <div
          key={chompOverlay.id}
          className="absolute z-30 pointer-events-none animate-comic-burst"
          style={
            {
              left: `${chompOverlay.screenX}px`,
              top: `${chompOverlay.screenY}px`,
              '--burst-rot': `${chompOverlay.rotation}deg`,
            } as React.CSSProperties
          }
        >
          <div className="relative flex items-center justify-center filter drop-shadow-[2px_2px_0px_#1E1B18]">
            <svg
              width="36"
              height="30"
              viewBox="0 0 120 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="overflow-visible"
            >
              <polygon
                points="60,2 73,26 98,12 95,38 118,48 97,64 110,88 83,82 72,100 56,84 36,98 34,74 8,80 22,58 2,42 26,34 16,10 44,22"
                fill={chompOverlay.color}
                stroke="#1E1B18"
                strokeWidth="5"
                strokeLinejoin="miter"
              />
              <polygon
                points="60,10 70,28 90,18 87,38 106,48 89,60 98,80 77,74 68,90 55,76 38,88 37,68 16,74 27,56 12,42 32,36 24,18 46,26"
                fill="none"
                stroke="#FFFDF8"
                strokeWidth="2.5"
                opacity="0.9"
              />
            </svg>

            <span
              className="absolute font-comic text-[11px] leading-none text-[#1E1B18] tracking-wider uppercase select-none"
              style={{
                WebkitTextStroke: '0.6px #1E1B18',
                color: chompOverlay.textColor,
              }}
            >
              {chompOverlay.text}
            </span>
          </div>
        </div>
      )}

      {/* START PLAY OVERLAY */}
      {isPaused && !showDeathModal && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/30 backdrop-blur-xs pointer-events-auto">
          <div className="flex flex-col items-center gap-2 p-6 rounded-xl border-3 border-[#1E1B18] bg-[#FFFDF8] shadow-[5px_5px_0px_#1E1B18] text-center max-w-sm">
            <SlinkHungry size={84} className="mb-1 -rotate-3" color={wormColor} />
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18]">
              <span
                className="w-3.5 h-3.5 rounded-full border-2 border-[#1E1B18] inline-block shrink-0 shadow-xs"
                style={{ backgroundColor: wormColor }}
              />
              <span className="font-comic text-xs uppercase text-[#1E1B18] tracking-wider font-bold">
                {callsign || 'SLINK_VIPER'}
              </span>
            </div>
            <h3
              className="font-comic text-3xl uppercase tracking-wider drop-shadow-[2px_2px_0px_#1E1B18]"
              style={{
                color: wormColor,
                WebkitTextStroke: '0.8px #1E1B18',
              }}
            >
              READY TO SLITHER?
            </h3>
            <p className="font-body text-xs text-[#5C3D2E] font-semibold mb-1">
              Chomp juicy oranges, strawberries, plums &amp; apples! Dodge fast centipedes, swift snakes &amp; chubby slugs!
            </p>

            {/* DIFFICULTY SELECTOR */}
            <div className="w-full my-2 p-2 rounded-lg bg-white border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] flex flex-col gap-1.5">
              <span className="font-comic text-[11px] uppercase tracking-wider text-[#1E1B18] font-bold text-left">
                SELECT DIFFICULTY:
              </span>
              <div className="grid grid-cols-3 gap-1.5 w-full">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playBeep(450);
                    setDifficulty('easy');
                  }}
                  className={`py-1 px-1.5 rounded text-xs font-comic uppercase font-bold border-2 border-[#1E1B18] transition-all cursor-pointer ${
                    difficulty === 'easy'
                      ? 'bg-[#70A288] text-white shadow-[2px_2px_0px_#1E1B18]'
                      : 'bg-[#FFF8ED] text-[#1E1B18] hover:bg-[#FFF0D6]'
                  }`}
                >
                  🌱 CASUAL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playBeep(600);
                    setDifficulty('medium');
                  }}
                  className={`py-1 px-1.5 rounded text-xs font-comic uppercase font-bold border-2 border-[#1E1B18] transition-all cursor-pointer ${
                    difficulty === 'medium'
                      ? 'bg-[#FFD13B] text-[#1E1B18] shadow-[2px_2px_0px_#1E1B18]'
                      : 'bg-[#FFF8ED] text-[#1E1B18] hover:bg-[#FFF0D6]'
                  }`}
                >
                  ⚡ HUNTER
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playBeep(750);
                    setDifficulty('hard');
                  }}
                  className={`py-1 px-1.5 rounded text-xs font-comic uppercase font-bold border-2 border-[#1E1B18] transition-all cursor-pointer ${
                    difficulty === 'hard'
                      ? 'bg-[#E63946] text-white shadow-[2px_2px_0px_#1E1B18]'
                      : 'bg-[#FFF8ED] text-[#1E1B18] hover:bg-[#FFF0D6]'
                  }`}
                >
                  🔥 CARNAGE
                </button>
              </div>
              <span className="text-[10px] font-body text-[#5C3D2E] font-medium text-left">
                {difficulty === 'easy' && 'Slow opponents, gentle cutoffs & easy grazing.'}
                {difficulty === 'medium' && 'Smart intercepting predators + mass loss on boost.'}
                {difficulty === 'hard' && 'Hyper predators, turbo cutoffs & relentless hunting!'}
              </span>
            </div>

            <button
              type="button"
              onClick={playGame}
              className="comic-btn w-full bg-[#FFD13B] hover:bg-[#FFE066] text-[#1E1B18] text-xl py-3 px-6 cursor-pointer mt-1"
            >
              <Play className="h-5 w-5 fill-current mr-2 inline" />
              SLITHER IN! GO!
            </button>
            <span className="font-hand text-xs font-bold text-[#1E1B18] mt-1">
              Mouse / Touch to Steer · Hold Space to Boost
            </span>
          </div>
        </div>
      )}

      {/* ACTIVE POWER-UP HUD */}
      <div className="absolute top-[135px] left-4 z-20 flex flex-col gap-2 pointer-events-none md:top-[160px]">
        {activeBuffs.map((buff) => (
          <div
            key={buff.type}
            className="flex items-center gap-2 bg-white border-2 border-[#1E1B18] px-3 py-1.5 rounded-lg shadow-[2px_2px_0px_#1E1B18]"
          >
            {buff.type === 'magnet' && <Magnet className="w-4 h-4 text-[#E63946]" />}
            {buff.type === 'phase' && <Shield className="w-4 h-4 text-[#78C0E0]" />}
            {buff.type === 'overclock' && <Zap className="w-4 h-4 text-[#FFD13B]" />}
            <span className="font-comic text-xs text-[#1E1B18] uppercase">{buff.type}</span>
            <div className="w-14 h-2 bg-[#FFF0D6] border border-[#1E1B18] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FA824C] transition-all duration-75"
                style={{ width: `${buff.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* MULTI-KILL COMBO OVERLAY */}
      {comboCount > 1 && (
        <div className="absolute top-20 right-1/2 translate-x-1/2 z-20 pointer-events-none animate-bounce">
          <div className="bg-[#FFD13B] text-[#1E1B18] font-comic text-sm md:text-base font-bold px-4 py-1 rounded-lg shadow-[3px_3px_0px_#1E1B18] border-2 border-[#1E1B18] tracking-wider uppercase -rotate-2">
            ★ {comboCount}X COMBO SLURP! ★
          </div>
        </div>
      )}

      {/* MOBILE CONTROLLER (Only visible when active in game) */}
      {!isPaused && !showDeathModal && (
        <div
          className={`absolute inset-x-0 z-30 pointer-events-none px-4 ${isFullscreen ? 'bottom-12 md:bottom-12' : 'bottom-0 md:bottom-2'}`}
          style={{ paddingBottom: isFullscreen ? 'calc(48px + env(safe-area-inset-bottom))' : 'calc(18px + env(safe-area-inset-bottom))' }}
        >
          <div className="relative w-full h-[104px]">
            <button
              data-mobile-control="true"
              type="button"
              className="absolute left-0 bottom-3 w-[74px] h-[74px] rounded-full border-3 border-[#1E1B18] bg-[#FA824C] text-[#FFF8ED] font-comic text-sm tracking-wider shadow-[3px_3px_0px_#1E1B18] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#1E1B18] touch-none select-none flex items-center justify-center z-40 cursor-pointer pointer-events-auto"
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
              BOOST!
            </button>

            <div
              data-mobile-control="true"
              className="absolute right-0 bottom-0 w-[100px] h-[100px] rounded-full border-3 border-[#1E1B18] bg-[#FFFDF8] shadow-[3px_3px_0px_#1E1B18] pointer-events-auto touch-none select-none z-40"
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
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-[#1E1B18]/30" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full border-2 border-[#1E1B18] bg-[#FFD13B] shadow-[2px_2px_0px_#1E1B18] flex items-center justify-center">
                <span className="text-[10px] font-comic font-bold text-[#1E1B18]">STEER</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {hintVisible && !isPaused && !showDeathModal && (
        <div className="absolute bottom-[125px] left-1/2 -translate-x-1/2 z-20 pointer-events-none whitespace-nowrap">
          <span className="font-comic text-xs uppercase px-3 py-1 rounded bg-[#FFD13B] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] text-[#1E1B18]">
            MOVE CURSOR TO STEER · HOLD CLICK TO BOOST!
          </span>
        </div>
      )}

      {/* DEATH MODAL: PHYSICAL RETRO COMIC PANEL */}
      {showDeathModal && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className="w-[340px] sm:w-[380px] rounded-xl border-3 border-[#1E1B18] bg-[#FFF8ED] p-6 text-center shadow-[6px_6px_0px_#1E1B18]">
            <div className="inline-block px-3 py-0.5 rounded bg-[#E63946] border-2 border-[#1E1B18] text-white font-comic text-sm uppercase -rotate-2 shadow-[2px_2px_0px_#1E1B18]">
              ZOIKS! TAIL BUMP!
            </div>

            <SlinkHungry size={92} className="mx-auto my-1" color={wormColor} waterDrop={false} showFruit={false} />

            <div className="font-comic text-3xl uppercase tracking-wide text-[#1E1B18]">
              ROUND FINISHED!
            </div>

            <div className="my-3 p-3.5 rounded-lg bg-white border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] flex flex-col gap-1.5">
              <div className="flex justify-between items-center font-comic text-base">
                <span className="text-[#5C3D2E]">SCORE:</span>
                <span className="text-[#FA824C] text-xl font-bold">{lastScore?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between items-center font-comic text-sm">
                <span className="text-[#5C3D2E]">RIVALS OUTSMARTED:</span>
                <span className="text-[#1E1B18] font-bold">{kills}</span>
              </div>
              <div className="flex justify-between items-center font-comic text-sm border-t border-[#1E1B18]/20 pt-1.5 mt-0.5">
                <span className="text-[#5C3D2E]">BEST RECORD:</span>
                <span className="text-[#70A288] font-bold">{bestToday.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 mt-2">
              <button
                onClick={shareThenRestart}
                className="comic-btn bg-[#78C0E0] hover:bg-[#59B4D1] text-[#1E1B18] px-4 py-2 text-base uppercase"
              >
                <Share2 className="h-4 w-4 mr-1.5 inline" />
                Share
              </button>
              <button
                onClick={playAgain}
                className="comic-btn bg-[#FFD13B] hover:bg-[#FFE066] text-[#1E1B18] px-5 py-2 text-base uppercase"
              >
                <RotateCcw className="h-4 w-4 mr-1.5 inline" />
                Play Again!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP HUD */}
      <div className="relative z-10 w-full flex items-start justify-between gap-4 pointer-events-none">
        {/* Score Card */}
        <div className="pointer-events-auto bg-white border-2 border-[#1E1B18] rounded-lg p-2.5 shadow-[3px_3px_0px_#1E1B18] flex flex-col min-w-[110px] md:min-w-[130px]">
          <div className="flex items-center justify-between gap-1 pb-1 mb-0.5 border-b border-[#1E1B18]/15">
            <span className="font-comic text-xs text-[#5C3D2E] tracking-wider uppercase">
              YOUR SCORE
            </span>
            <span
              className={`text-[9px] font-comic uppercase font-bold px-1.5 py-0.2 rounded border ${
                difficulty === 'hard'
                  ? 'bg-[#E63946] text-white border-[#1E1B18]'
                  : difficulty === 'medium'
                  ? 'bg-[#FFD13B] text-[#1E1B18] border-[#1E1B18]'
                  : 'bg-[#70A288] text-white border-[#1E1B18]'
              }`}
            >
              {difficulty === 'hard' ? '🔥 CARNAGE' : difficulty === 'medium' ? '⚡ HUNTER' : '🌱 CASUAL'}
            </span>
          </div>
          <span className="font-comic text-3xl text-[#FA824C] leading-none">
            {score.toLocaleString()}
          </span>
          <div className="flex items-center justify-between text-xs font-body font-bold text-[#1E1B18] pt-1 border-t border-[#1E1B18]/15 mt-1">
            <span>CHOMPS</span>
            <span className="text-[#E63946]">{kills}</span>
          </div>
          <div className="flex items-center justify-between text-xs font-body font-bold text-[#5C3D2E]">
            <span>RECORD</span>
            <span className="text-[#70A288]">{bestToday.toLocaleString()}</span>
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
                className="p-1.5 rounded-lg bg-white border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] text-[#1E1B18] hover:bg-[#FFD13B] cursor-pointer"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Mini Roster */}
          <div className="hidden md:flex relative bg-white border-2 border-[#1E1B18] rounded-lg p-2.5 shadow-[3px_3px_0px_#1E1B18] min-w-[160px] flex-col">
            <div className="flex items-center justify-between text-xs font-comic text-[#1E1B18] uppercase pb-1 mb-1 border-b border-[#1E1B18]/20">
              <span className="tracking-wider flex items-center gap-1 font-bold">
                <Trophy className="w-3.5 h-3.5 text-[#FFD13B]" /> TOP SLINKS
              </span>
            </div>
            <div className="flex flex-col gap-1 font-body text-xs font-semibold">
              {roster.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between py-0.5 px-1.5 rounded-lg border transition-all ${
                    item.isPlayer
                      ? 'text-[#111111] font-bold bg-[#B4F000] border-[#111111] shadow-[1px_1px_0px_#111111]'
                      : 'text-[#111111] bg-[#F4EEDF]/80 border-transparent hover:border-[#111111]'
                  }`}
                >
                  <span className="truncate max-w-[105px] flex items-center gap-1.5">
                    <span className="font-comic text-xs font-black text-[#555555]">
                      {idx + 1}.
                    </span>{' '}
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-[#111111] shrink-0"
                      style={{ backgroundColor: item.color || '#B4F000' }}
                    />
                    <span className="truncate font-comic text-xs font-bold">{item.name}</span>
                  </span>
                  <span className="font-comic text-xs font-black">
                    {item.score.toLocaleString()}
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
