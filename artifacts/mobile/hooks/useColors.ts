import colors from "@/constants/colors";
import { useTheme } from "@/lib/theme";

/**
 * Returns the design tokens for the current color scheme.
 * Reads from the app's ThemeProvider so users can override system setting
 * via settings (light / dark / system).
 */
export function useColors() {
  const { scheme } = useTheme();
  const palette = scheme === "dark" ? (colors as any).dark : (colors as any).light;
  return { ...palette, radius: (colors as any).radius };
}
