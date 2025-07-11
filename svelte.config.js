import adapter from '@sveltejs/adapter-static';
import { sveltePreprocess } from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
		}
	},
	preprocess: sveltePreprocess({
		scss: {
			includePaths: ['src/lib/style'],
			prependData: `@use 'theme.scss' as *;`
		}
	})
};

export default config;
