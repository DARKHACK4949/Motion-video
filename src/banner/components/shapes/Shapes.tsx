import React from "react";
import { COLORS } from "../../config/theme";

/** Hand-built vector decor (NOT product artwork). All shapes are drawn in a 100×100 viewBox. */

type ShapeProps = { id: string };

export const Cross: React.FC<ShapeProps> = ({ id }) => (
  <svg viewBox="0 0 100 100" width="100%" height="100%">
    <defs>
      <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0.15" stopColor={COLORS.cross} />
        <stop offset="1" stopColor={COLORS.crossTint} />
      </linearGradient>
    </defs>
    <path
      d="M38 8h24a6 6 0 0 1 6 6v18h18a6 6 0 0 1 6 6v24a6 6 0 0 1-6 6H68v18a6 6 0 0 1-6 6H38a6 6 0 0 1-6-6V68H14a6 6 0 0 1-6-6V38a6 6 0 0 1 6-6h18V14a6 6 0 0 1 6-6z"
      fill={`url(#${id}-g)`}
    />
  </svg>
);

export const Capsule: React.FC<ShapeProps & { color: string }> = ({ id, color }) => (
  <svg viewBox="0 0 100 40" width="100%" height="100%" style={{ overflow: "visible" }}>
    <defs>
      <linearGradient id={`${id}-c`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
        <stop offset="0.35" stopColor={color} />
        <stop offset="1" stopColor={color} stopOpacity="0.85" />
      </linearGradient>
      <linearGradient id={`${id}-w`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" />
        <stop offset="0.6" stopColor={COLORS.capsuleWhite} />
        <stop offset="1" stopColor="#D5DEEE" />
      </linearGradient>
      <clipPath id={`${id}-clip`}>
        <rect x="2" y="2" width="96" height="36" rx="18" />
      </clipPath>
    </defs>
    <g clipPath={`url(#${id}-clip)`}>
      <rect x="0" y="0" width="52" height="40" fill={`url(#${id}-c)`} />
      <rect x="50" y="0" width="50" height="40" fill={`url(#${id}-w)`} />
      <rect x="49" y="0" width="2.5" height="40" fill="#000" opacity="0.08" />
      <rect x="10" y="7" width="80" height="6" rx="3" fill="#fff" opacity="0.55" />
    </g>
  </svg>
);

export const Pill: React.FC<ShapeProps> = ({ id }) => (
  <svg viewBox="0 0 100 100" width="100%" height="100%">
    <defs>
      <radialGradient id={`${id}-p`} cx="0.38" cy="0.32" r="0.75">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="0.7" stopColor="#EEF2F9" />
        <stop offset="1" stopColor="#C9D3E6" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="46" fill={`url(#${id}-p)`} />
    <circle cx="50" cy="50" r="38" fill="none" stroke="#D3DBEA" strokeWidth="2" />
    <rect x="20" y="48.5" width="60" height="3" rx="1.5" fill="#C3CDE0" />
  </svg>
);

export const Leaf: React.FC<ShapeProps> = ({ id }) => (
  <svg viewBox="0 0 100 100" width="100%" height="100%">
    <defs>
      <linearGradient id={`${id}-l`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={COLORS.leafLight} />
        <stop offset="1" stopColor={COLORS.leafDark} />
      </linearGradient>
    </defs>
    <path d="M8 88C10 44 40 10 92 8C90 58 58 90 8 88Z" fill={`url(#${id}-l)`} />
    <path d="M10 86C34 62 58 38 88 12" stroke="#E9FBE9" strokeOpacity="0.7" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    <path d="M34 62L30 44M50 46L48 28M64 34L66 20M40 56L58 58M56 42L74 42" stroke="#E9FBE9" strokeOpacity="0.35" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
