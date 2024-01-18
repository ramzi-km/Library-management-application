/** @type {import('tailwindcss').Config} */
export const content = ["./src/**/*.{html,ts}"];
export const theme = {
  screens: {
    sm: "480px",
    md: "768px",
    lg: "976px",
    cXl: "1200px",
    xl: "1440px",
  },
  extend: {
    colors: {
      primary: "var(--primary-color)",
      secondary: "var(--secondary-color)",
      accent: "var(--accent-color)",
      textp: "var(--textP-color)",
      texts: "var(--textS-color)",
      textg: "var(--textG-color)",
      bgclr: "var(--bg-color)",
      "disabled-color": "#ff0000",
    },
  },
};
export const daisyui = {
  themes: [
    {
      light: {
        primary: "#ff7f50", //primary
        secondary: "#ffffff", //secondary
        accent: "#ff5722", //accent
        "base-100": "#f4f4f4", //bg-color
        neutral: "#555555", //textS
        info: "#6c757d", //textG
        success: "#333333", //textP
      },
      dark: {
        primary: "#ff7f50", //primary
        secondary: "#262626", //secondary
        accent: "#ff5722", //accent
        "base-100": "#1e1e1e", //bg-color
        neutral: "#f5f5f5", //textS
        info: "#adb5bd", //textG
        success: "#ffffff", //textP
      },
    },
  ],
};
export const plugins = [require("daisyui")];
