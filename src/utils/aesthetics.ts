/**
 * Extracts initials from a name string for avatar display.
 */
export function getInitials(name?: string | null): string {
  const trimmed = name?.trim();
  if (!trimmed) return "AC";
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) {
    return ([...parts[0]][0] + [...parts[parts.length - 1]][0]).toUpperCase();
  }
  return [...trimmed].slice(0, 2).join("").toUpperCase();
}
