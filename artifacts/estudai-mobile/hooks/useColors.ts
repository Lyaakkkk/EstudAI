import colors from '@/constants/colors';
import { useThemeControls } from '@/context/ThemeContext';

/**
 * Devolve as cores do tema atual (claro ou escuro).
 * O tema segue o celular até a pessoa escolher outro no botão de lua/sol.
 */
export function useColors() {
  const { scheme } = useThemeControls();
  const palette = scheme === 'dark' ? colors.dark : colors.light;
  return { ...palette, radius: colors.radius, scheme };
}
