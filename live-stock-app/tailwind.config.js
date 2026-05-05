/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#006a35", // More vibrant Premium Emerald
        "primary-container": "#e0f2e9",
        "primary-fixed": "#a7f3d0",
        "primary-fixed-dim": "#6ee7b7",
        "on-primary": "#ffffff",
        "on-primary-container": "#064e3b",
        "on-primary-fixed": "#022c22",
        "on-primary-fixed-variant": "#047857",
        
        secondary: "#005db7",
        "secondary-container": "#64a1ff",
        "secondary-fixed": "#d6e3ff",
        "secondary-fixed-dim": "#a9c7ff",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#003670",
        "on-secondary-fixed": "#001b3d",
        "on-secondary-fixed-variant": "#00468c",
        
        tertiary: "#7a4c00",
        "tertiary-container": "#9b6200",
        "tertiary-fixed": "#ffddb8",
        "tertiary-fixed-dim": "#ffb95f",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#fff0e3",
        "on-tertiary-fixed": "#2a1700",
        "on-tertiary-fixed-variant": "#653e00",
        
        surface: "#fcfdfc",
        background: "#fcfdfc",
        "on-surface": "#0b1c30",
        "on-surface-variant": "#40493f",
        "surface-variant": "#d3e4fe",
        "surface-tint": "#1a6c30",
        
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f1f4f2",
        "surface-container": "#e5eeff",
        "surface-container-high": "#dce9ff",
        "surface-container-highest": "#d3e4fe",
        
        outline: "#707a6e",
        "outline-variant": "#bfc9bb",
        
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",

        "inverse-surface": "#213145",
        "inverse-on-surface": "#eaf1ff",
        "inverse-primary": "#88d98f",
      },
      fontFamily: {
        headline: ["Manrope_800ExtraBold", "Manrope_700Bold", "sans-serif"],
        body: ["Inter_400Regular", "Inter_500Medium", "sans-serif"],
        label: ["Inter_600SemiBold", "sans-serif"],
      },
      fontSize: {
        "display-md": ["2.75rem", { lineHeight: "3rem", letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-sm": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.02em", fontWeight: "700" }],
        "label-md": ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.05em", fontWeight: "700" }],
      },
      boxShadow: {
        editorial: "0 12px 40px rgba(25, 28, 28, 0.06)",
        bento: "0 8px 30px rgba(0, 0, 0, 0.02)",
        premium: "0 20px 50px rgba(0, 0, 0, 0.05)",
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      }
    },
  },
  plugins: [],
};