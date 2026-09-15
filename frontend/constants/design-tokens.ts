/**
 * ANVYRA Design Tokens
 * Warm luxury palette derived from the approved logo:
 *   deep brown (#3D1A0A), bronze (#A0673A), gold accent (#C4956A),
 *   cream (#F7F3EE), warm parchment (#EDE8E0)
 */

export const COLORS = {
  // Brand primaries
  brown: {
    950: "#1C0A04",
    900: "#3D1A0A",
    800: "#5C2E1A",
    700: "#7A4429",
    600: "#96582E",
    500: "#A0673A",
    400: "#B87E52",
    300: "#C4956A",
    200: "#D4AF8C",
    100: "#E8D5BC",
    50:  "#F5EDE0",
  },
  cream: {
    DEFAULT: "#F7F3EE",
    warm:    "#EDE8E0",
    parchment: "#E6DFD5",
    muted:   "#D6CCBF",
  },
  gold: "#C4956A",
  goldDeep: "#A0673A",
} as const;

export const BRAND = {
  tagline: "Style Meets You",
  name: "ANVYRA",
} as const;
