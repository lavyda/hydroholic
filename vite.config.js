import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), SvelteKitPWA({ registerType: 'autoUpdate' })],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
};

export default config;
