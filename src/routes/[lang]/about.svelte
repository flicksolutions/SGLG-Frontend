<script context="module">
	import { checkLocale } from '../../functions';
	export async function preload(page, session) {
		const { lang } = page.params;
		return checkLocale(lang);
	}
</script>

<script>
	import {locale} from "svelte-i18n";

	export let lang;

	$locale !== lang && ($locale = lang);
</script>

<svelte:head>
	<title>About</title>
</svelte:head>

<h1>About this site {$locale}</h1>

<p>This is the 'about' page. There's not much here.</p>