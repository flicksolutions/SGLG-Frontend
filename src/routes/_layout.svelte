<script context="module">
	import { waitLocale } from 'svelte-i18n'

	export async function preload() {
		// awaits for the loading of the default dictionaries
		return waitLocale()
	}
</script>

<script>
	import Nav from '../components/Nav.svelte';
	import Footer from '../components/Footer.svelte';
	import { onMount } from 'svelte';

	export let segment;

	let FontTracker;

	onMount(async () => {
		//code for font-tracking
		window.MTFontIds = ['691880'];
		window.MTUserId ='002422c7-d577-4caf-966e-d57cdfef6b8b';
		const module = await import('../../static/fonts/mtiFontTrackingCode.js');
		FontTracker = module.default;
	});

</script>

<Nav {segment}/>

<main>
	<slot></slot>
</main>

<Footer/>

<style lang="scss" global>
	@import "./style/global.scss";
</style>