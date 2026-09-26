import React from 'react';

interface PhantomLogoProps {
  size?: number;
  className?: string;
}

export const PhantomLogo: React.FC<PhantomLogoProps> = ({ size = 36, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      {/* Outer rounded badge */}
      <rect
        x="3"
        y="3"
        width="122"
        height="122"
        rx="26"
        fill="#AB9FF2"
        stroke="#1E1B18"
        strokeWidth="6"
      />

      {/* Glossy top-left accent */}
      <path
        d="M20 28C20 22 24 18 30 18H98C104 18 108 22 108 28C108 22 100 14 90 14H38C26 14 18 22 18 32V90C18 100 22 106 28 106C22 106 20 102 20 96V28Z"
        fill="#FFFFFF"
        opacity="0.3"
      />

      {/* Phantom Ghost Body */}
      <path
        d="M96 66C96 48.33 81.67 34 64 34C46.33 34 32 48.33 32 66V88C32 90.21 34.69 91.31 36.25 89.75L44 82L51.75 89.75C53.31 91.31 56 90.21 56 88V82L64 90L72 82V88C72 90.21 74.69 91.31 76.25 89.75L84 82L91.75 89.75C93.31 91.31 96 90.21 96 88V66Z"
        fill="#FFFFFF"
        stroke="#1E1B18"
        strokeWidth="5.5"
        strokeLinejoin="round"
      />

      {/* Eyes */}
      <ellipse cx="52" cy="61" rx="4.5" ry="6.5" fill="#534BAE" />
      <ellipse cx="76" cy="61" rx="4.5" ry="6.5" fill="#534BAE" />
      <circle cx="50.5" cy="58.5" r="1.5" fill="#FFFFFF" />
      <circle cx="74.5" cy="58.5" r="1.5" fill="#FFFFFF" />
    </svg>
  );
};
