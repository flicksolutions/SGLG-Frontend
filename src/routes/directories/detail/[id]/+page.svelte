<script>
	import { SVGS, ASSET_URL } from '$lib/constants';
	import ContentBoxes from '$lib/components/ContentBoxes.svelte';
	import { onMount } from 'svelte';
	import { addAccordionListener, createLabel } from '$lib/functions';
	import ImageGrid from '$lib/components/ImageGrid.svelte';
	import { m } from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';

	let { data } = $props();
	let { item } = data;

	const setLinks = (arr) => {
		if (Array.isArray(arr)) {
			return arr.map((object) => {
				let url = object.url.includes('http') ? object.url : `http://${object.url}`;
				return `<a href="${url}" target="_blank">${url}</a>`;
			});
		}
	};

	const cleanProps = (dirtyItem) => {
		const filterKeys = ['internal', 'referenced_by', 'references'];
		let clean = Object.keys(dirtyItem)
			.filter(
				(key) => dirtyItem.itemtype.frontend_fields.includes(key) && !filterKeys.includes(key)
			)
			.reduce((obj, key) => {
				//convert val to date
				if (key.includes('date') && dirtyItem[key]) {
					obj[key] =
						dirtyItem.itemtype?.directory === 'publications'
							? new Date(dirtyItem[key]).getFullYear()
							: new Date(dirtyItem[key]).toLocaleDateString(getLocale(), {
									year: 'numeric',
									month: 'numeric',
									day: 'numeric'
								});
				} else if (key.includes('link')) {
					obj[key] = setLinks(dirtyItem[key]);
				} else {
					obj[key] = dirtyItem[key];
				}

				return obj;
			}, {});
		if (dirtyItem.itemtype?.directory === 'publications') {
			clean = { title: clean.title, person: clean.person, ...clean };
		}
		return clean;
	};

	const frontEndProps = cleanProps(item);
	const references = item?.referenced_by
		.filter((ref) => ref.entities_id)
		.map((ref) => {
			return {
				title: ref.entities_id.itemtype?.directory,
				content: cleanProps(ref.entities_id)
			};
		});

	onMount(async () => {
		addAccordionListener(document.querySelectorAll('.accordion-item'));
	});
</script>

<svelte:head>
	<title>{item.title}</title>
</svelte:head>

<div class="spacer" style="height: 10vw;"></div>

<section class="content-layout">
	<h1 class:internal={item.internal}>
		{@html SVGS[item.itemtype.directory]}
		{item?.title}
	</h1>

	{#if item?.image}
		<img
			src={`${ASSET_URL}${item?.image.id}?width=750&height=350&fit=inside&format=webp`}
			alt={item?.image?.title}
		/>
	{/if}

	<div class="props">
		<ContentBoxes content={frontEndProps} />
		{#each references as ref}
			<h3>{m[ref.title]({ count: 1 })}:</h3>
			<ContentBoxes content={ref.content} />
		{/each}
	</div>
	{#if item.files}
		<ImageGrid images={item.files} />
	{/if}
	<button class="button" onclick={() => window.history.back()}>{m.back()}</button>
</section>

<style lang="scss">
	.button {
		align-self: baseline;
		@media (min-width: $medium) {
			grid-column: 1;
			grid-row: 1;
		}
	}

	.content-layout img {
		margin-bottom: 2em;
		max-width: 100%;
		grid-row: span 2;
		width: fit-content;
		align-self: center;
		@media (min-width: $medium) {
			align-self: normal;
		}
	}

	h1 {
		margin-top: 0;
	}
</style>
