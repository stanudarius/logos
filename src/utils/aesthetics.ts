import type { MoodAesthetic } from "../types";

/**
 * Maps a visual mood string to a complete aesthetic configuration
 * for theming the phone emulator and card display.
 */
export function getMoodAesthetic(mood: string): MoodAesthetic {
  switch (mood) {
    case "blinding_sunlight":
      return {
        bg: "bg-[#FAFAF7]",
        text: "text-[#121315]",
        sub: "text-[#55565A]",
        accent: "text-[#B5A48B] border-[#B5A48B]",
        border: "border-[#EAE9E4]",
        glow: "shadow-[0_15px_40px_rgba(181,164,139,0.12)]",
        cardBg: "bg-white",
        btnColor: "bg-[#1A1A1A] hover:bg-black text-[#FDFCF8]",
        badgeColor: "bg-[#B5A48B]/10 text-[#5C4D37] border-[#B5A48B]/20",
        display: "Light Radiant (Solar)"
      };
    case "cosmic_void":
      return {
        bg: "bg-[#121214]",
        text: "text-white",
        sub: "text-[#9E9E9E]",
        accent: "text-[#666666] border-[#333333]",
        border: "border-[#222225]",
        glow: "shadow-[0_15px_40px_rgba(0,0,0,0.6)]",
        cardBg: "bg-[#1A1A1E]",
        btnColor: "bg-white hover:bg-gray-100 text-black",
        badgeColor: "bg-white/10 text-white border-white/20",
        display: "Stark Void (Void)"
      };
    case "crimson_twilight":
      return {
        bg: "bg-[#1C1415]",
        text: "text-[#FAF0F1]",
        sub: "text-[#BFA4A6]",
        accent: "text-[#B85C5C] border-[#542B2D]",
        border: "border-[#2D1D1E]",
        glow: "shadow-[0_15px_40px_rgba(184,92,92,0.15)]",
        cardBg: "bg-[#281D1F]",
        btnColor: "bg-[#FAF0F1] hover:bg-white text-[#1C1415]",
        badgeColor: "bg-[#B85C5C]/20 text-[#FAF0F1] border-[#B85C5C]/30",
        display: "Crimson Twilight"
      };
    case "emerald_mist":
      return {
        bg: "bg-[#0A1710]",
        text: "text-[#F1FAF4]",
        sub: "text-[#A3C7B5]",
        accent: "text-[#5CB888] border-[#1D3A2C]",
        border: "border-[#14261C]",
        glow: "shadow-[0_15px_40px_rgba(92,184,136,0.15)]",
        cardBg: "bg-[#11241A]",
        btnColor: "bg-[#F1FAF4] hover:bg-white text-[#0A1710]",
        badgeColor: "bg-[#5CB888]/20 text-[#F1FAF4] border-[#5CB888]/30",
        display: "Emerald Mist"
      };
    case "amber_glow":
      return {
        bg: "bg-[#1F170B]",
        text: "text-[#FCF7ED]",
        sub: "text-[#D9C4A3]",
        accent: "text-[#D49C43] border-[#3F2B14]",
        border: "border-[#2A1D0E]",
        glow: "shadow-[0_15px_40px_rgba(212,156,67,0.15)]",
        cardBg: "bg-[#291F11]",
        btnColor: "bg-[#FCF7ED] hover:bg-white text-[#1F170B]",
        badgeColor: "bg-[#D49C43]/20 text-[#FCF7ED] border-[#D49C43]/30",
        display: "Amber Glow"
      };
    default:
      return {
        bg: "bg-[#FDFCF8]",
        text: "text-[#1A1A1A]",
        sub: "text-[#4A4A4A]",
        accent: "text-[#B5A48B] border-[#B5A48B]",
        border: "border-[#E9E8E3]",
        glow: "shadow-[0_15px_40px_rgba(0,0,0,0.04)]",
        cardBg: "bg-white",
        btnColor: "bg-black text-white hover:bg-gray-900",
        badgeColor: "bg-[#B5A48B]/10 text-black border-[#B5A48B]/20",
        display: "Default Radiant"
      };
  }
}

/**
 * Extracts initials from a name string for avatar display.
 */
export function getInitials(name: string): string {
  if (!name) return "AC";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
