import { createTheme } from "@mui/material/styles";

export const baseFontSizes = {
  h1: 32,
  h2: 28,
  h3: 24,
  body: 16,
  small: 14,
};

export const theme = createTheme({
  typography: {
    h1: {
      fontSize: `${baseFontSizes.h1}px`,
    },
    h2: {
      fontSize: `${baseFontSizes.h2}px`,
    },
    h3: {
      fontSize: `${baseFontSizes.h3}px`,
    },
    body1: {
      fontSize: `${baseFontSizes.body}px`,
    },
    body2: {
      fontSize: `${baseFontSizes.small}px`,
    },
  },
});
