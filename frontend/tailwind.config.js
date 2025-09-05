/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}'
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Work Sans"', ...defaultTheme.fontFamily.sans]
            },
            colors: {
                'pale-green': '#C4D6B0',
                'light-green': '#EAF3DF',
                'dark-green': '#042A2B',
                'calendar-1': '#ECF2E5',
                'calendar-2': '#D8E4CB',
                'calendar-3': '#BAD0A1',
                'green': '#06432D',
                'shadow': '#F4F4F4',
                'no-resp': '#808080',
                'background': '#FFFFFF',
                'error': '#FF8882'
            }
        }
    },
    plugins: []
};
