import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Preference = "system" | "light" | "dark";
type Scheme = "light" | "dark";

type ThemeValue = {
  scheme: Scheme;
  toggle: () => void;
};

const THEME_STORAGE_KEY = "estudai-theme-v1";

export const ThemeContext = createContext<ThemeValue | null>(null);

/**
 * Guarda a escolha de tema (claro/escuro). Enquanto a pessoa não escolher,
 * o app segue a aparência do celular.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [preference, setPreference] = useState<Preference>("system");

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((stored) => {
        if (active && (stored === "light" || stored === "dark")) {
          setPreference(stored);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const scheme: Scheme =
    preference === "system" ? (system === "dark" ? "dark" : "light") : preference;

  const toggle = useCallback(() => {
    const next: Scheme = scheme === "dark" ? "light" : "dark";
    setPreference(next);
    AsyncStorage.setItem(THEME_STORAGE_KEY, next).catch(() => undefined);
  }, [scheme]);

  const value = useMemo(() => ({ scheme, toggle }), [scheme, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeControls(): ThemeValue {
  const context = useContext(ThemeContext);
  const system = useColorScheme();
  // Fora do provider, apenas segue o celular.
  return context ?? { scheme: system === "dark" ? "dark" : "light", toggle: () => undefined };
}
