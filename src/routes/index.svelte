<script>
	import { _ } from 'svelte-i18n';
	import DirectusSDK from '@directus/sdk-js';
	import Sticker from '../components/Sticker.svelte';
	import { onMount } from 'svelte';
	import { locale } from 'svelte-i18n';

	const directus = new DirectusSDK('https://backend.ruralhistory.ch');

	let directories;
	let items = [];


	onMount(async () => {
		directories = (await directus.items('directories').read()).data.directories; //get the collections that are relevant as a directory
		for (const directory of directories) {
			items = [...items, ...(await directus.items(directory).read({ //get each item in every relevant collection
				fields: ['title','id','date'] //get only these fields
			})).data.map(i => {
				i.collection = directory //add the collection to the item
				if ($locale.slice(0,2) !== 'de') {
					directus.items(`${directory}_translations`).read({ //get the translated title and set it as the new title
						filter: {
							[`${directory}_id`]: i.id,
							languages_code: $locale.slice(0,2)
						},
						fields: 'title'
					}).then(r => i.title = r.data[0].title)
				}

				return i
			})];
		}
	})
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