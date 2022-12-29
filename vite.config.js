import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), SvelteKitPWA({
		registerType: 'autoUpdate',
		includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'safari-pinned-tab.svg'],
		manifest: {
			name: 'Hydroholic',
			short_name: 'Hydroholic',
			description: 'Information for various water sports',
			theme_color: '#ffffff',
			icons: [
				{
					src: 'android-chrome-192x192.png',
					sizes: '192x192',
					type: 'image/png'
				},
				{
					src: 'android-chrome-512x512.png',
					sizes: '512x512',
					type: 'image/png'
				},
				{
					src: 'android-chrome-512x512.png',
					sizes: '512x512',
					type: 'image/png',
					purpose: 'any maskable'
				}
			]
		},
	})],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
};

export default config;
