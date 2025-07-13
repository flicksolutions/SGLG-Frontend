<script>
	/** @type {{ data: import('./$types').LayoutData, children: import('svelte').Snippet }} */
	let { data, children } = $props();
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	let { pages } = data;
	let FontTracker;

	onMount(async () => {
		//code for font-tracking
		window.MTFontIds = ['691880'];
		window.MTUserId = '002422c7-d577-4caf-966e-d57cdfef6b8b';
		const module = await import('/fonts/mtiFontTrackingCode.js?url');
		FontTracker = module.default;
	});
	const segment = $derived(page.url.pathname.split('/').filter(Boolean).pop() ?? '');
</script>

<Header {segment} pages={pages.filter((p) => p.slug !== 'impressum')} />
<!-- Filtering out the Impressum for the Header -->

<main>
	{@render children()}
</main>

<Footer {segment} {pages} />

<style global>
	@import '../lib/style/global.scss';
	main {
		margin-top: $header-height;
	}
</style>
