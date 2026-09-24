import React from 'react';

/**
 * Hand-drawn Retro Cartoon Characters for SLINK
 * Thick black ink outlines, flat vintage colors, humorous expressions, no generic repeated PNGs!
 */

export interface CharacterProps {
  className?: string;
  size?: number;
  color?: string;
  secondaryColor?: string;
}

const getAltColor = (mainColor: string, secondary?: string): string => {
  if (secondary) return secondary;
  const c = mainColor.toLowerCase();
  if (c === '#ffd13b' || c === '#ffe066' || c === '#ffaa00') return '#FA824C';
  if (c === '#5c3d2e') return '#FA824C';
  if (c === '#e63946' || c === '#ff5964') return '#FFD13B';
  if (c === '#70a288') return '#FFD13B';
  if (c === '#78c0e0') return '#FFD13B';
  return '#FFD13B';
};

// 1. Slink The Hungry Slither (coiled up, tongue out, excited googly eyes)
export const SlinkHungry: React.FC<CharacterProps> = ({
  className = '',
  size = 120,
  color = '#FA824C',
  secondaryColor,
}) => {
  const altColor = getAltColor(color, secondaryColor);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      {/* Tail segment */}
      <ellipse cx="28" cy="98" rx="14" ry="12" fill={color} stroke="#1E1B18" strokeWidth="4" />
      <path d="M18 96C18 96 22 93 26 95" stroke="#1E1B18" strokeWidth="3" strokeLinecap="round" />

      {/* Body segment 2 */}
      <ellipse cx="48" cy="94" rx="16" ry="14" fill={altColor} stroke="#1E1B18" strokeWidth="4" />
      <ellipse cx="48" cy="94" rx="7" ry="5" fill={color} opacity="0.6" />

      {/* Body segment 3 */}
      <ellipse cx="70" cy="85" rx="17" ry="15" fill={color} stroke="#1E1B18" strokeWidth="4" />
      <path d="M64 80C67 78 72 82 76 80" stroke="#1E1B18" strokeWidth="3" strokeLinecap="round" />

      {/* Body segment 4 */}
      <ellipse cx="88" cy="70" rx="18" ry="16" fill={altColor} stroke="#1E1B18" strokeWidth="4" />

      {/* Neck arch */}
      <ellipse cx="98" cy="50" rx="18" ry="18" fill={color} stroke="#1E1B18" strokeWidth="4" />

      {/* Big expressive head */}
      <circle cx="102" cy="38" r="24" fill={color} stroke="#1E1B18" strokeWidth="4" />

      {/* Cheerful tummy patch */}
      <ellipse cx="106" cy="44" rx="13" ry="10" fill="#FFFDF8" stroke="#1E1B18" strokeWidth="3" />

      {/* Big Googly Cartoon Eye Left */}
      <ellipse cx="94" cy="26" rx="9" ry="11" fill="#FFFFFF" stroke="#1E1B18" strokeWidth="3.5" />
      <circle cx="96" cy="27" r="4.5" fill="#1E1B18" />
      <circle cx="94.5" cy="25" r="1.5" fill="#FFFFFF" />

      {/* Big Googly Cartoon Eye Right */}
      <ellipse cx="112" cy="28" rx="8" ry="10" fill="#FFFFFF" stroke="#1E1B18" strokeWidth="3.5" />
      <circle cx="113" cy="29" r="4" fill="#1E1B18" />
      <circle cx="111.5" cy="27" r="1.5" fill="#FFFFFF" />

      {/* Rosy cartoon cheek */}
      <ellipse cx="118" cy="40" rx="4" ry="2.5" fill="#FF5964" />

      {/* Silly open mouth with tongue */}
      <path
        d="M96 42C100 48 110 47 114 41"
        stroke="#1E1B18"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="#5C3D2E"
      />
      <path
        d="M102 44C102 48 108 48 108 44"
        fill="#FF5964"
        stroke="#1E1B18"
        strokeWidth="2.5"
      />

      {/* Floating shiny cartoon apple / food */}
      <circle cx="40" cy="32" r="12" fill="#E63946" stroke="#1E1B18" strokeWidth="3.5" />
      <path d="M40 20C41 15 45 14 45 14" stroke="#5C3D2E" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="44" cy="18" rx="4" ry="2" fill="#70A288" stroke="#1E1B18" strokeWidth="2" />
      <circle cx="37" cy="28" r="2" fill="#FFFFFF" />

      {/* Action comic speed droplets */}
      <path d="M60 30L68 34" stroke="#1E1B18" strokeWidth="3" strokeLinecap="round" />
      <path d="M62 24L72 26" stroke="#1E1B18" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

// 2. Slink The Speed Demon (Aviator goggles, smoke puff behind, super fast dash)
export const SlinkSpeedy: React.FC<CharacterProps> = ({
  className = '',
  size = 130,
  color = '#FA824C',
  secondaryColor,
}) => {
  const altColor = getAltColor(color, secondaryColor);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 150 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      {/* Retro smoke poof clouds */}
      <circle cx="20" cy="65" r="10" fill="#FFF8ED" stroke="#1E1B18" strokeWidth="3" />
      <circle cx="15" cy="52" r="7" fill="#FFF8ED" stroke="#1E1B18" strokeWidth="3" />
      <circle cx="32" cy="72" r="8" fill="#FFF8ED" stroke="#1E1B18" strokeWidth="3" />

      {/* Comic speed streaks */}
      <path d="M5 45L40 45" stroke="#1E1B18" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" />
      <path d="M12 80L50 80" stroke="#1E1B18" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 6" />

      {/* Trailing body segments */}
      <ellipse cx="42" cy="60" rx="14" ry="10" fill={altColor} stroke="#1E1B18" strokeWidth="4" />
      <ellipse cx="62" cy="56" rx="16" ry="11" fill={color} stroke="#1E1B18" strokeWidth="4" />
      <ellipse cx="84" cy="52" rx="18" ry="13" fill={altColor} stroke="#1E1B18" strokeWidth="4" />
      <ellipse cx="106" cy="48" rx="20" ry="15" fill={color} stroke="#1E1B18" strokeWidth="4" />

      {/* Head leaning forward */}
      <ellipse cx="126" cy="44" rx="20" ry="18" fill={color} stroke="#1E1B18" strokeWidth="4" />

      {/* Retro Pilot Goggles on Head */}
      <rect x="110" y="30" width="14" height="12" rx="4" fill="#78C0E0" stroke="#1E1B18" strokeWidth="3" />
      <rect x="126" y="30" width="14" height="12" rx="4" fill="#78C0E0" stroke="#1E1B18" strokeWidth="3" />
      <path d="M124 36H126" stroke="#1E1B18" strokeWidth="3" />
      <path d="M102 36L110 36" stroke="#5C3D2E" strokeWidth="3.5" />
      <path d="M140 36L144 38" stroke="#5C3D2E" strokeWidth="3.5" />

      {/* Goggle glass shine */}
      <line x1="113" y1="33" x2="119" y2="39" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <line x1="129" y1="33" x2="135" y2="39" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

      {/* Determined grin */}
      <path d="M120 54C126 58 136 54 138 50" stroke="#1E1B18" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M136 49L139 52" stroke="#1E1B18" strokeWidth="3" strokeLinecap="round" />

      {/* Flying red comic scarf */}
      <path
        d="M112 50C100 58 80 56 75 62C72 66 84 66 94 62C102 58 114 54 114 50Z"
        fill="#E63946"
        stroke="#1E1B18"
        strokeWidth="3"
      />
    </svg>
  );
};

// 3. Slink The Peeking Mascot (peeking over card border with mischievous grin)
export const SlinkPeeking: React.FC<CharacterProps> = ({ className = '', size = 110 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    {/* Coiled body resting below */}
    <path
      d="M10 88C15 70 35 68 50 78C65 88 85 86 95 72C102 62 110 74 115 88"
      stroke="#FA824C"
      strokeWidth="20"
      strokeLinecap="round"
    />
    <path
      d="M10 88C15 70 35 68 50 78C65 88 85 86 95 72C102 62 110 74 115 88"
      stroke="#1E1B18"
      strokeWidth="4"
      fill="none"
    />

    {/* Head popping up */}
    <ellipse cx="60" cy="40" rx="28" ry="24" fill="#FFD13B" stroke="#1E1B18" strokeWidth="4" />

    {/* Huge silly eyes looking right at you */}
    <ellipse cx="48" cy="30" rx="11" ry="13" fill="#FFFFFF" stroke="#1E1B18" strokeWidth="3.5" />
    <circle cx="50" cy="32" r="5" fill="#1E1B18" />
    <circle cx="48" cy="30" r="2" fill="#FFFFFF" />

    <ellipse cx="72" cy="30" rx="11" ry="13" fill="#FFFFFF" stroke="#1E1B18" strokeWidth="3.5" />
    <circle cx="70" cy="32" r="5" fill="#1E1B18" />
    <circle cx="68" cy="30" r="2" fill="#FFFFFF" />

    {/* Raised cartoon eyebrow */}
    <path d="M42 16C46 12 54 13 56 16" stroke="#1E1B18" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M68 18C72 15 78 17 82 20" stroke="#1E1B18" strokeWidth="3.5" strokeLinecap="round" />

    {/* Cheeky smile */}
    <path
      d="M50 48C56 56 66 56 72 48"
      stroke="#1E1B18"
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="#FFFDF8"
    />
    <ellipse cx="42" cy="46" rx="4" ry="2" fill="#FF7A30" />
    <ellipse cx="78" cy="46" rx="4" ry="2" fill="#FF7A30" />
  </svg>
);

// 4. Slink Full Belly Champion (Chubby, happy with tiny gold crown and cartoon stars)
export const SlinkChampion: React.FC<CharacterProps> = ({ className = '', size = 120 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 130 130"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    {/* Coiled base */}
    <ellipse cx="65" cy="100" rx="45" ry="20" fill="#70A288" stroke="#1E1B18" strokeWidth="4" />
    <ellipse cx="65" cy="94" rx="38" ry="16" fill="#FA824C" stroke="#1E1B18" strokeWidth="4" />

    {/* Chubby belly segment */}
    <ellipse cx="65" cy="74" rx="30" ry="24" fill="#FFD13B" stroke="#1E1B18" strokeWidth="4" />
    <ellipse cx="65" cy="78" rx="18" ry="14" fill="#FFF8ED" stroke="#1E1B18" strokeWidth="3" />

    {/* Head */}
    <ellipse cx="65" cy="46" rx="22" ry="20" fill="#FA824C" stroke="#1E1B18" strokeWidth="4" />

    {/* Silly tilted paper crown */}
    <path
      d="M50 30L55 18L65 24L75 18L80 30Z"
      fill="#FFD13B"
      stroke="#1E1B18"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <circle cx="55" cy="18" r="2.5" fill="#E63946" />
    <circle cx="65" cy="24" r="2.5" fill="#78C0E0" />
    <circle cx="75" cy="18" r="2.5" fill="#E63946" />

    {/* Happy closed arched eyes (^_^) */}
    <path d="M52 44C55 39 60 39 63 44" stroke="#1E1B18" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M67 44C70 39 75 39 78 44" stroke="#1E1B18" strokeWidth="3.5" strokeLinecap="round" />

    {/* Big jolly grin */}
    <path
      d="M56 52C60 60 70 60 74 52Z"
      fill="#5C3D2E"
      stroke="#1E1B18"
      strokeWidth="3.5"
    />
    <path d="M62 55C64 57 66 57 68 55" stroke="#FF5964" strokeWidth="2.5" />

    {/* Twinkling retro cartoon stars */}
    <path d="M22 45L25 36L28 45L36 48L28 51L25 60L22 51L14 48Z" fill="#FFD13B" stroke="#1E1B18" strokeWidth="2" />
    <path d="M102 35L104 28L106 35L112 37L106 39L104 46L102 39L96 37Z" fill="#78C0E0" stroke="#1E1B18" strokeWidth="2" />
  </svg>
);

// 5. Slink The Tangled Knot ("ZOIKS!" - knotted up, funny dizzy swirl eyes)
export const SlinkOops: React.FC<CharacterProps> = ({
  className = '',
  size = 110,
  color = '#FA824C',
  secondaryColor,
}) => {
  const altColor = getAltColor(color, secondaryColor);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      {/* Tangled pretzel knot body */}
      <path
        d="M30 75C20 50 45 35 60 50C75 65 95 50 85 30C75 10 40 20 30 45C20 70 50 90 70 85C90 80 100 65 95 50"
        stroke="#1E1B18"
        strokeWidth="24"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30 75C20 50 45 35 60 50C75 65 95 50 85 30C75 10 40 20 30 45C20 70 50 90 70 85C90 80 100 65 95 50"
        stroke={color}
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Head looking confused */}
      <circle cx="92" cy="40" r="18" fill={altColor} stroke="#1E1B18" strokeWidth="4" />

    {/* Dizzy swirl eye left */}
    <circle cx="86" cy="36" r="6" fill="#FFFDF8" stroke="#1E1B18" strokeWidth="2" />
    <path d="M84 36A2 2 0 1 0 88 36A2 2 0 1 0 84 36" stroke="#1E1B18" strokeWidth="2" />

    {/* Dizzy swirl eye right */}
    <circle cx="98" cy="38" r="6" fill="#FFFDF8" stroke="#1E1B18" strokeWidth="2" />
    <path d="M96 38A2 2 0 1 0 100 38A2 2 0 1 0 96 38" stroke="#1E1B18" strokeWidth="2" />

    {/* Wobbly wavy mouth */}
    <path d="M86 48C89 46 92 50 95 47" stroke="#1E1B18" strokeWidth="3" strokeLinecap="round" />

    {/* Sweating cartoon droplet */}
    <path
      d="M106 25C106 25 110 30 110 32C110 34 108 36 106 36C104 36 102 34 102 32C102 30 106 25 106 25Z"
      fill="#78C0E0"
      stroke="#1E1B18"
      strokeWidth="2"
    />
  </svg>
  );
};

// Comic Sound Burst Banner ("POOF!", "CRUNCH!", "WIGGLE!", "ZOOM!")
export const ComicSoundBurst: React.FC<{
  sound: string;
  color?: string;
  className?: string;
  rotate?: string;
}> = ({ sound, color = '#FFD13B', className = '', rotate = '-3deg' }) => (
  <div
    style={{ transform: `rotate(${rotate})`, backgroundColor: color }}
    className={`inline-block border-2 sm:border-3 border-[#1E1B18] px-3 sm:px-4 py-1 sm:py-1.5 shadow-[3px_3px_0px_#1E1B18] ${className}`}
  >
    <span className="font-comic text-base sm:text-xl font-bold tracking-wider text-[#1E1B18] select-none">
      {sound}
    </span>
  </div>
);

export const SoundBurst: React.FC<{
  text?: string;
  sound?: string;
  color?: string;
  className?: string;
  rotate?: string;
}> = ({ text, sound, color, className, rotate }) => (
  <ComicSoundBurst
    sound={text || sound || 'POW!'}
    color={color}
    className={className}
    rotate={rotate}
  />
);

// Comic Action Speech Bubble
export const ComicSpeechBubble: React.FC<{
  quote: string;
  sub?: string;
  className?: string;
}> = ({ quote, sub, className = '' }) => (
  <div className={`relative bg-white border-3 border-[#1E1B18] rounded-xl p-3 shadow-[4px_4px_0px_#1E1B18] ${className}`}>
    <p className="font-comic text-lg text-[#1E1B18] leading-tight uppercase tracking-wide">
      "{quote}"
    </p>
    {sub && <span className="font-body text-xs font-semibold text-[#5C3D2E] block mt-0.5">{sub}</span>}
  </div>
);
