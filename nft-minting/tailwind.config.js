// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "gold-500": "#C9A84C",
        "gold-600": "#D4B86A",
        "forest-900": "#0E1208", // bg-primary
        "forest-800": "#161E0F", // bg-surface
        "forest-700": "#1C2614", // bg-elevated
        "forest-500": "#2D5A3D", // accent-green
        "forest-400": "#3D7A52", // accent-green-light

        "text-primary": "#F5F0E8",
        "text-secondary": "#A8B89A",
        "text-muted": "#6B7A60",

        "border-subtle": "rgba(201, 168, 76, 0.12)",
        "border-default": "rgba(201, 168, 76, 0.25)",

        "glass-black": "rgba(14, 18, 8, 0.85)", // Update old reference
        "deep-black": "#0E1208", // Map deep-black to forest-900 bg-primary
        "neon-cyan": "#C9A84C", // Temporary aliasing old cyan to gold so the app doesn't break
        "neon-purple": "#2D5A3D", // Temporary aliasing to green
        "neon-blue": "#3D7A52"
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
      },
      boxShadow: {
        "card": "0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(201, 168, 76, 0.12)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(201, 168, 76, 0.25)",
        "btn-primary": "0 0 20px rgba(201,168,76,0.25)",
        "btn-primary-hover": "0 0 40px rgba(201,168,76,0.4)",
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: 1, boxShadow: "0 0 20px rgba(201,168,76,0.25)" },
          "50%": { opacity: 0.7, boxShadow: "0 0 10px rgba(201,168,76,0.15)" },
        },
        shimmer: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        scroll: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
        "marquee": "marquee 12s linear infinite",
      },
    },
  },
  plugins: [],
};
