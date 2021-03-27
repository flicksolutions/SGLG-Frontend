<script context="module">
	import DirectusSDK from '@directus/sdk-js';
	const directus = new DirectusSDK('https://backend.ruralhistory.ch');

	export async function preload(page, session) {
		let directories = (await directus.items('directories').read()).data.directories; //get the collections that are relevant as a directory


		return { directus, directories };
	}
</script>

<script>
	import { _ } from 'svelte-i18n';
	import Sticker from '../components/Sticker.svelte';
	import { onMount } from 'svelte';
	import { locale } from 'svelte-i18n';

	export let directus;
	export let directories;


	let items = [];


	const getItems = async locale => {
		const readItem = {};
		let returnItems = []
		if (locale === 'de') {
			readItem.fields = ['title','id','date'];//get only these fields
		} else {
			readItem.fields = ['translations.title', 'id','date'];
			readItem['deep[translations][_filter][languages_code][_eq]'] = locale;
		}
		for (const directory of directories) {
			returnItems = [...returnItems, ...(await directus.items(directory).read(readItem)).data.map(i => { //get each item in every relevant collection
				i.collection = directory //add the collection to the item
				if (!i.title) {
					//i.title = i.translations[0]?.title;
				}
				return i
			})];
		}
		return returnItems
	}

	$: {
		$locale = $locale;
		getItems($locale.slice(0, 2)).then(i => items = i);
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