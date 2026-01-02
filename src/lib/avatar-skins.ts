export type AvatarSkin = 
  | 'default'
  | 'cyberpunk'
  | 'pastel'
  | 'neon'
  | 'fantasy'
  | 'retro'
  | 'monochrome'
  | 'cosmic';

export interface SkinColors {
  skin: number;
  eyes: number;
  eyesEmissive: number;
  pupils: number;
  body: number;
  ears: number;
  hair: number;
  accessories: number;
  accessoriesEmissive: number;
  mouth: number;
}

export interface SkinStyle {
  id: AvatarSkin;
  name: string;
  description: string;
  colors: SkinColors;
  metalness: number;
  roughness: number;
  emissiveIntensity: number;
  icon: string;
}

export const avatarSkins: Record<AvatarSkin, SkinStyle> = {
  default: {
    id: 'default',
    name: 'Default Kawaii',
    description: 'Cute purple and pink aesthetic',
    colors: {
      skin: 0xffd4e5,
      eyes: 0x8b5cf6,
      eyesEmissive: 0x8b5cf6,
      pupils: 0x1e1b4b,
      body: 0xa78bfa,
      ears: 0xffd4e5,
      hair: 0xc084fc,
      accessories: 0x8b5cf6,
      accessoriesEmissive: 0x8b5cf6,
      mouth: 0x1e1b4b,
    },
    metalness: 0.3,
    roughness: 0.7,
    emissiveIntensity: 0.3,
    icon: '💜',
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'High-tech neon with chrome accents',
    colors: {
      skin: 0xe0e7ff,
      eyes: 0x00ffff,
      eyesEmissive: 0x00ffff,
      pupils: 0x0a0a0a,
      body: 0x1e293b,
      ears: 0xe0e7ff,
      hair: 0xff00ff,
      accessories: 0x00ffff,
      accessoriesEmissive: 0x00ffff,
      mouth: 0xff0080,
    },
    metalness: 0.8,
    roughness: 0.2,
    emissiveIntensity: 0.8,
    icon: '⚡',
  },
  pastel: {
    id: 'pastel',
    name: 'Pastel Dream',
    description: 'Soft pastel colors for a gentle vibe',
    colors: {
      skin: 0xfff5f7,
      eyes: 0xb4d5ff,
      eyesEmissive: 0xb4d5ff,
      pupils: 0x4a5568,
      body: 0xffd6e8,
      ears: 0xfff5f7,
      hair: 0xc4b5fd,
      accessories: 0xfbbf24,
      accessoriesEmissive: 0xfbbf24,
      mouth: 0xff9eb3,
    },
    metalness: 0.1,
    roughness: 0.9,
    emissiveIntensity: 0.2,
    icon: '🌸',
  },
  neon: {
    id: 'neon',
    name: 'Neon Nights',
    description: 'Vibrant neon glow',
    colors: {
      skin: 0x2d1b4e,
      eyes: 0x00ff00,
      eyesEmissive: 0x00ff00,
      pupils: 0xffffff,
      body: 0x1a0933,
      ears: 0x2d1b4e,
      hair: 0xff00ff,
      accessories: 0xffff00,
      accessoriesEmissive: 0xffff00,
      mouth: 0x00ffff,
    },
    metalness: 0.5,
    roughness: 0.3,
    emissiveIntensity: 1.0,
    icon: '🌟',
  },
  fantasy: {
    id: 'fantasy',
    name: 'Fantasy Elf',
    description: 'Mystical forest creature',
    colors: {
      skin: 0xd4f1d4,
      eyes: 0x22c55e,
      eyesEmissive: 0x22c55e,
      pupils: 0x14532d,
      body: 0x86efac,
      ears: 0xd4f1d4,
      hair: 0xfde047,
      accessories: 0xfacc15,
      accessoriesEmissive: 0xfacc15,
      mouth: 0x86198f,
    },
    metalness: 0.2,
    roughness: 0.6,
    emissiveIntensity: 0.4,
    icon: '🧝',
  },
  retro: {
    id: 'retro',
    name: 'Retro Wave',
    description: '80s synthwave aesthetic',
    colors: {
      skin: 0xffc0cb,
      eyes: 0xff6b9d,
      eyesEmissive: 0xff6b9d,
      pupils: 0x1a1a2e,
      body: 0x9d4edd,
      ears: 0xffc0cb,
      hair: 0xff006e,
      accessories: 0xffbe0b,
      accessoriesEmissive: 0xffbe0b,
      mouth: 0x3a0ca3,
    },
    metalness: 0.6,
    roughness: 0.4,
    emissiveIntensity: 0.5,
    icon: '🕹️',
  },
  monochrome: {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Classic black and white',
    colors: {
      skin: 0xf5f5f5,
      eyes: 0x333333,
      eyesEmissive: 0x666666,
      pupils: 0x000000,
      body: 0xcccccc,
      ears: 0xf5f5f5,
      hair: 0x555555,
      accessories: 0x222222,
      accessoriesEmissive: 0x444444,
      mouth: 0x111111,
    },
    metalness: 0.7,
    roughness: 0.5,
    emissiveIntensity: 0.2,
    icon: '⚪',
  },
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic Star',
    description: 'Galaxy-inspired with stars',
    colors: {
      skin: 0xe9d5ff,
      eyes: 0x8b5cf6,
      eyesEmissive: 0xd8b4fe,
      pupils: 0x1e1b4b,
      body: 0x4c1d95,
      ears: 0xe9d5ff,
      hair: 0x6366f1,
      accessories: 0xfbbf24,
      accessoriesEmissive: 0xfde047,
      mouth: 0xa855f7,
    },
    metalness: 0.4,
    roughness: 0.6,
    emissiveIntensity: 0.6,
    icon: '✨',
  },
};

export function getSkinStyle(skin: AvatarSkin): SkinStyle {
  return avatarSkins[skin] || avatarSkins.default;
}
