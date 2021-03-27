<script context="module">
	/*import DirectusSDK from '@directus/sdk-js';
	const directus = new DirectusSDK('https://backend.ruralhistory.ch');*/

	/*export async function preload(page, session) {
		let directories = (await directus.items('directories').read()).data.directories; //get the collections that are relevant as a directory
		return { directories };
	}*/
</script>

<script>
	import { _ } from 'svelte-i18n';
	import Sticker from '../components/Sticker.svelte';
	import { locale } from 'svelte-i18n';
	import { getItems } from '../functions';

	//export let directories;


	let items = [];
	let content = "";


	$: {
		$locale = $locale;
		getItems({
			locale: $locale.slice(0, 2),
			fields: ['content','items.item.*','items.collection'],
			translatedFields: ['content', 'items.*.*'],
			collections: ['homepage']
		}).then(i => {
			items = i[0].data.items;
			content = i[0].data.content;
		});
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
				<!--{JSON.stringify(item)}-->
			<li>
				<a href="{`/directory/detail/${item.collection}/${item.item.id}`}" class="{item.collection}">{item.item.title}</a>
				<div><p>{item.item.date}</p><p>{item.collection}</p></div>
			</li>
			{/each}
		</ol>
		<a class="button" href="/directory">Alle Einträge</a>
	</section>
	<section>
		{#each content as block}
			<h3>{block.title}</h3>
			<div>{@html block.content}</div>
		{/each}
	</section>
	<!-- other content -->
</div>

<style lang="scss">

</style>