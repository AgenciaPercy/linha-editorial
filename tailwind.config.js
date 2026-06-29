/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
        status: {
          pendente: "#94a3b8",
          aprovado: "#22c55e",
          ajustar: "#f59e0b",
          nao_usar: "#ef4444",
        },
      },
    },
  },
  plugins: [],
};
