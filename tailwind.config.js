module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {

        extend: {
            colors: {
                primary: "rgb(16, 25, 136)",
                secondary: "rgb(243, 19, 107)",
            },
            keyframes: {
                shake: {
                    "0%": {
                        backgroundColor: "rgb(243, 19, 107)",
                        boxShadow: '0 0 5px rgb(130, 2, 99)',
                        transform: "rotate(-1deg)"
                    },
                    "50%": {
                        backgroundColor: "rgb(243, 19, 107)",
                        boxShadow: "0 0 20 px rgb(130, 2, 99)",
                        transform: "rotate(-2deg)"
                    },
                    "100%": {
                        backgroundColor: "rgb(243, 19, 107)",
                        boxShadow: "0 0 5 px rgb(130, 2, 99)",
                        transform: "rotate(-3deg)"
                    }
                }
            },
            animation: {
                shake: "shake 1300ms infinite"
            }

        },
    },
    plugins: [],
}