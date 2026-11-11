import { useState } from "react";

const DEFAULT_AVATAR_PALETTE = {
  bgTop: "#2f6e49",
  bgBottom: "#173d2e",
  accent: "#a9c67b",
  ring: "#dff0c2",
} as const;

const AVATAR_PALETTES = [
  DEFAULT_AVATAR_PALETTE,
  { bgTop: "#35785c", bgBottom: "#184237", accent: "#98d4a0", ring: "#d4f5dc" },
  { bgTop: "#446e38", bgBottom: "#233d1d", accent: "#c7db82", ring: "#eef5c7" },
  { bgTop: "#275d63", bgBottom: "#14353d", accent: "#88d0c7", ring: "#cdf3ee" },
  { bgTop: "#546b3b", bgBottom: "#2a3b1b", accent: "#d1cf7b", ring: "#f3f2c6" },
  { bgTop: "#3a5f70", bgBottom: "#1c3342", accent: "#9bc7db", ring: "#d4ebf5" },
] as const;

function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

interface UserAvatarProps {
  email?: string | null;
  avatarUrl?: string | null;
  size?: number;
}

export function UserAvatar({ email, avatarUrl, size = 38 }: UserAvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);

  if (avatarUrl && !imgFailed) {
    return (
      <img
        src={avatarUrl}
        alt={email ? `${email} profile picture` : "Member profile"}
        width={size}
        height={size}
        onError={() => setImgFailed(true)}
        className="user-avatar-img"
        style={{ width: size, height: size }}
      />
    );
  }

  const seed = hashString((email || "kalp-member").trim().toLowerCase());
  const palette =
    AVATAR_PALETTES[seed % AVATAR_PALETTES.length] ?? DEFAULT_AVATAR_PALETTE;
  const gradientId = `kalp-avatar-bg-${seed}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
      className="user-avatar-svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={palette.bgTop} />
          <stop offset="100%" stopColor={palette.bgBottom} />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="20" fill={`url(#${gradientId})`} />
      <circle cx="30" cy="10" r="7" fill={palette.accent} opacity="0.22" />
      <circle cx="11" cy="31" r="6" fill={palette.ring} opacity="0.14" />
      <circle cx="20" cy="15.5" r="5.5" fill={palette.ring} />
      <path
        d="M10.5 33.2C11.8 27.6 15.5 24.5 20 24.5C24.5 24.5 28.2 27.6 29.5 33.2"
        fill={palette.ring}
      />
    </svg>
  );
}

