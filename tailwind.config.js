/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
        "./components/**/*.{vue,js,ts,jsx,tsx}",
        "./views/**/*.{vue,js,ts,jsx,tsx}",
        "./App.vue"
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#4b91e2",
                "accent": "#B76E79",
                "background-dark": "#121820",
                "surface": "rgba(42, 48, 55, 0.4)",
            },
            fontFamily: {
                "display": ["Inter", "Noto Sans SC", "sans-serif"],
                "serif": ["Merriweather", "Noto Serif SC", "serif"]
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "2xl": "1rem",
                "full": "9999px"
            },
        },
    },
    plugins: [],
}
