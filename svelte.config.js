import adapter from '@sveltejs/adapter-static';
import { sveltePreprocess } from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: sveltePreprocess({
		scss: {
			includePaths: ['src/lib/style'],
			prependData: `@use 'theme.scss' as *;`
		}
	}),
	kit: {
		paths: {
			base: ''
			// relative: false
		},
		adapter: adapter({
			fallback: '404.html'
		})
	}
};

export default config;
