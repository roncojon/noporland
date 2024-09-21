// tailwind.config.js
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			keyframes: {
				'ripple-effect': {
					'0%': {
						backgroundColor: 'rgba(0, 0, 0, 0)',  // Fully transparent background
						boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
					},
					'50%': {
						backgroundColor: 'rgb(54, 38, 78)', // Lighter primary color
						boxShadow: '0 0 15px 10px rgba(59, 130, 246, 0.3)',
					},
					'100%': {
						backgroundColor: 'rgba(0, 0, 0, 0)', // Fully transparent again
						boxShadow: '0 0 30px 20px rgba(59, 130, 246, 0)',
					},
				},
				'ripple-effect-hover': {
					'0%': {
						backgroundColor: 'rgba(0, 0, 0, 0)',  // Fully transparent background
						boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
					},
					'50%': {
						backgroundColor: 'rgb(35, 20, 61)', // Darker primary color on hover
						boxShadow: '0 0 15px 10px rgba(37, 99, 235, 0.4)',
					},
					'100%': {
						backgroundColor: 'rgba(0, 0, 0, 0)', // Fully transparent again
						boxShadow: '0 0 30px 20px rgba(37, 99, 235, 0)',
					},
				},
			},
			animation: {
				'ripple-effect': 'ripple-effect 2.5s infinite',
				'ripple-effect-hover': 'ripple-effect-hover 2.5s infinite', // For hover/focus
			},
		},
	},
	plugins: [require('daisyui')],
};
