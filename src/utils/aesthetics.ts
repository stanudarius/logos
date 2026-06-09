


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
