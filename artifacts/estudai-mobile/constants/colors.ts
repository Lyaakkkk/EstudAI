/**
 * Paleta — azul-marinho, vermelho, ardósia, marrom e cinza claro.
 *
 *   Cinza claro #EDEDED · Vermelho #D93732 · Azul-marinho #26303A
 *   Ardósia #3F5058 · Marrom #88563B
 *
 * Proporção de uso (pensada para estudar com personalidade jovem):
 *   ~60%  Cinza claro e branco       → fundos e cartões (leitura limpa)
 *   ~25%  Azul-marinho + ardósia     → textos, títulos e menu (contraste forte)
 *   ~10%  Vermelho                   → botões, seleção e destaques (a energia)
 *   ~5%   Marrom                     → tags e pequenos detalhes quentes
 *
 * Tons intermediários (fundo, cartão, borda) são variações dessas cores.
 */

const colors = {
  light: {
    text: "#26303A",
    tint: "#D93732",
    background: "#F7F7F6",
    foreground: "#26303A",
    card: "#FFFFFF",
    cardForeground: "#26303A",
    primary: "#D93732",
    primaryForeground: "#FFFFFF",
    secondary: "#EDEDED",
    secondaryForeground: "#26303A",
    muted: "#F1F1F0",
    mutedForeground: "#566870",
    accent: "#EADFD7",
    accentForeground: "#6E4430",
    destructive: "#B5261F",
    destructiveForeground: "#FFFFFF",
    success: "#3F5058",
    border: "#E1E1DF",
    input: "#CFCFCD",
    subtle: "#8A979D",
    navy: "#26303A",
    shadow: "#26303A",
  },
  dark: {
    text: "#EDEDED",
    tint: "#F0605A",
    background: "#161D24",
    foreground: "#EDEDED",
    card: "#1F2A33",
    cardForeground: "#EDEDED",
    primary: "#D93732",
    primaryForeground: "#FFFFFF",
    secondary: "#2A3641",
    secondaryForeground: "#EDEDED",
    muted: "#1B242C",
    mutedForeground: "#A9B6BC",
    accent: "#3A2A20",
    accentForeground: "#D9A98A",
    destructive: "#F0605A",
    destructiveForeground: "#161D24",
    success: "#9FC1C9",
    border: "#34424D",
    input: "#44525D",
    subtle: "#7E8E96",
    navy: "#26303A",
    shadow: "#000000",
  },
  radius: 20,
};

export default colors;
