import { useFontSize } from "./context/FontSizeContext";
import { baseFontSizes } from "./utils/theme";

type TextVariant = keyof typeof baseFontSizes;

const increments: Record<TextVariant, number> = {
  h1: 8,
  h2: 6,
  h3: 4,
  body: 10,
  small: 6,
};

export const useDynamicFont = (variant: TextVariant) => {
  const { scale } = useFontSize();
  const baseSize = baseFontSizes[variant];
  const increment = increments[variant];

  const computedSize = baseSize + scale * increment;
  return `${computedSize}px`;
};
