/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    bg: '#050214',
                    surface: '#0f0f16',
                    primary: '#7112AF',
                    secondary: '#520EA4',
                    accent: '#330B99',
                    text: '#ffffff',
                }
            },
            fontFamily: {
                sans: ['Cairo', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
