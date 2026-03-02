/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                bg: {
                    primary: 'var(--color-bg-primary)',
                    surface: 'var(--color-bg-surface)',
                    elevated: 'var(--color-bg-elevated)',
                },
                accent: {
                    gold: {
                        DEFAULT: 'var(--color-accent-gold)',
                        hover: 'var(--color-accent-gold-hover)',
                        muted: 'var(--color-accent-gold-muted)',
                    },
                    green: 'var(--color-accent-green)',
                },
                text: {
                    primary: 'var(--color-text-primary)',
                    secondary: 'var(--color-text-secondary)',
                    muted: 'var(--color-text-muted)',
                },
                border: {
                    subtle: 'var(--color-border-subtle)',
                    default: 'var(--color-border-default)',
                    active: 'var(--color-border-active)',
                },
            },
            fontFamily: {
                sans: ['DM Sans', 'sans-serif'],
                playfair: ['Playfair Display', 'serif'],
            },
            boxShadow: {
                'card': '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 0 1px var(--color-border-subtle)',
                'btn': '0 2px 10px rgba(201, 168, 76, 0.2)',
            },
            borderRadius: {
                'card': '12px',
                'btn': '6px',
                'badge': '4px',
            }
        },
    },
    plugins: [],
}
