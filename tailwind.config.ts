import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}'
    ],
    theme: {
        extend: {
            gridTemplateColumns: {
                '13': 'repeat(13, minmax(0,1fr))',
            },
        }
    }
}
export default config;