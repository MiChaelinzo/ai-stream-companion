import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { AvatarSkin, avatarSkins, SkinStyle } from "@/lib/avatar-skins";
import { Palette, Check } from "@phosphor-icons/react";
import { motion } from "framer-motion";

interface AvatarSkinSelectorProps {
  currentSkin: AvatarSkin;
  onSkinChange: (skin: AvatarSkin) => void;
}

export function AvatarSkinSelector({ currentSkin, onSkinChange }: AvatarSkinSelectorProps) {
  const skinEntries = Object.values(avatarSkins);

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-primary/5 border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Palette size={20} weight="fill" className="text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Avatar Skins</h3>
          <p className="text-sm text-muted-foreground">Customize your avatar's appearance</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {skinEntries.map((skin) => (
          <SkinCard
            key={skin.id}
            skin={skin}
            isSelected={currentSkin === skin.id}
            onSelect={() => onSkinChange(skin.id)}
          />
        ))}
      </div>
    </Card>
  );
}

interface SkinCardProps {
  skin: SkinStyle;
  isSelected: boolean;
  onSelect: () => void;
}

function SkinCard({ skin, isSelected, onSelect }: SkinCardProps) {
  return (
    <motion.button
      onClick={onSelect}
      className={`
        relative p-4 rounded-xl border-2 transition-all text-left
        ${isSelected 
          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' 
          : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5'
        }
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <Check size={14} weight="bold" className="text-primary-foreground" />
          </div>
        </div>
      )}

      <div className="mb-3">
        <div className="text-3xl mb-2">{skin.icon}</div>
        <h4 className="font-semibold text-sm mb-1">{skin.name}</h4>
        <p className="text-xs text-muted-foreground line-clamp-2">{skin.description}</p>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        <ColorSwatch color={skin.colors.skin} />
        <ColorSwatch color={skin.colors.eyes} />
        <ColorSwatch color={skin.colors.hair} />
        <ColorSwatch color={skin.colors.body} />
        <ColorSwatch color={skin.colors.accessories} />
      </div>
    </motion.button>
  );
}

interface ColorSwatchProps {
  color: number;
}

function ColorSwatch({ color }: ColorSwatchProps) {
  const hexColor = `#${color.toString(16).padStart(6, '0')}`;
  
  return (
    <div 
      className="w-4 h-4 rounded-full border border-border/50"
      style={{ backgroundColor: hexColor }}
    />
  );
}
