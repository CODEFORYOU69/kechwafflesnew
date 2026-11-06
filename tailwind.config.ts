import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
  			serif: ['var(--font-serif)', 'Georgia', 'serif'],
  			mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
  		},
  		transitionTimingFunction: {
  			door: 'var(--ease-door)',
  			soft: 'var(--ease-out)',
  			spring: 'var(--ease-spring)',
  		},
  		colors: {
  			espresso: {
  				'950': 'hsl(var(--espresso-950) / <alpha-value>)',
  				'900': 'hsl(var(--espresso-900) / <alpha-value>)',
  				'800': 'hsl(var(--espresso-800) / <alpha-value>)',
  				'700': 'hsl(var(--espresso-700) / <alpha-value>)',
  				'600': 'hsl(var(--espresso-600) / <alpha-value>)',
  			},
  			terracotta: {
  				'700': 'hsl(var(--terracotta-700) / <alpha-value>)',
  				'600': 'hsl(var(--terracotta-600) / <alpha-value>)',
  				'500': 'hsl(var(--terracotta-500) / <alpha-value>)',
  				'400': 'hsl(var(--terracotta-400) / <alpha-value>)',
  				'300': 'hsl(var(--terracotta-300) / <alpha-value>)',
  			},
  			gold: {
  				'700': 'hsl(var(--gold-700) / <alpha-value>)',
  				'500': 'hsl(var(--gold-500) / <alpha-value>)',
  				'400': 'hsl(var(--gold-400) / <alpha-value>)',
  				'300': 'hsl(var(--gold-300) / <alpha-value>)',
  				'200': 'hsl(var(--gold-200) / <alpha-value>)',
  			},
  			cream: {
  				'50': 'hsl(var(--cream-50) / <alpha-value>)',
  				'100': 'hsl(var(--cream-100) / <alpha-value>)',
  				'200': 'hsl(var(--cream-200) / <alpha-value>)',
  				'300': 'hsl(var(--cream-300) / <alpha-value>)',
  				'400': 'hsl(var(--cream-400) / <alpha-value>)',
  			},
  			zellige: {
  				'600': 'hsl(var(--zellige-600) / <alpha-value>)',
  				'400': 'hsl(var(--zellige-400) / <alpha-value>)',
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			shine: {
  				'0%': {
  					'background-position': '0% 0%'
  				},
  				'50%': {
  					'background-position': '100% 100%'
  				},
  				'100%': {
  					'background-position': '0% 0%'
  				}
  			},
  			spin: {
  				'0%': {
  					transform: 'rotate(0deg)'
  				},
  				'100%': {
  					transform: 'rotate(360deg)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			shine: 'shine var(--duration) infinite linear',
  			spin: 'spin var(--duration, 1s) infinite linear'
  		}
  	}
  },
  plugins: [
  	require("tailwindcss-animate"),
  	// Plain variants rather than `screens`: an object in `screens` disables min-*/max-*.
  	plugin(({ addVariant }) => {
  		addVariant("fine", "@media (hover: hover) and (pointer: fine)");
  		addVariant("coarse", "@media (pointer: coarse)");
  	}),
  ],
} satisfies Config;
