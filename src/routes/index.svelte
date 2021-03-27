<script context="module">
	import DirectusSDK from '@directus/sdk-js';
	const directus = new DirectusSDK('https://backend.ruralhistory.ch');

	export async function preload(page, session) {
		let directories = (await directus.items('directories').read()).data.directories; //get the collections that are relevant as a directory
		return { directories };
	}
</script>

<script>
	import { _ } from 'svelte-i18n';
	import Sticker from '../components/Sticker.svelte';
	import { onMount } from 'svelte';
	import { locale } from 'svelte-i18n';
	import { getItems } from '../functions';

	export let directories;


	let items = [];


	$: {
		$locale = $locale;
		getItems({ locale: $locale.slice(0, 2), fields: ['title','id','date'], translatedFields: ['title'], collections: ['homepage']}).then(i => items = i);
	}
</script>


<svelte:head>
	<title>{$_('Schweizerische Gesellschaft für ländliche Geschichte')}</title>
</svelte:head>

<div><!-- this element needs the background-img -->
	<Sticker />
	<section>
		<h2>Aktuell</h2>
		<ol>
			{#each items as item}
				{JSON.stringify(item)}
			<li>
				<a href="{`/directory/detail/${item.collection}/${item.id}`}" class="{item.collection}">{item.title}</a>
				<div><p>{item.date}</p><p>{item.collection}</p></div>
			</li>
			{/each}
		</ol>
		<a class="button" href="/directory">Alle Einträge</a>
	</section>
	<!-- other content -->
</div>

<style lang="scss">

</style>