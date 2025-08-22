<script>
	import { m } from '$lib/paraglide/messages.js';
	import { linkHandler } from '$lib/functions';
	import { ASSET_URL, SVGS } from '$lib/constants';
	import { createLabel } from '$lib/functions';
	import { getLocale } from '$lib/paraglide/runtime';
	import { page } from '$app/state';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	const MAXNUMBEROFCOLUMNS = data.content?.columns || 5;
	let galleryWidth = $state(600);

	let dividedItems = $derived.by(() => {
		let numberOfColumns = Math.min(MAXNUMBEROFCOLUMNS, Math.floor(galleryWidth / 150));
		let result = Array.from({ length: numberOfColumns }, () => []);
		data.items.forEach((item, idx) => {
			result[idx % numberOfColumns].push(item);
		});
		return result;
	});
	const randomIndex = Math.floor(Math.random() * page.data?.bgUrl.length);
</script>

<svelte:head>
	<title>{data.content?.title}</title>
</svelte:head>

<div class="mobile-header">
	<img src={page.data?.bgUrl[randomIndex]} alt="featured" class="featured" />
</div>
<div class="spacer"></div>

<section class="content-layout">
	<h2>{data.content?.title}</h2>
	<div class="description">
		{@html data.content?.description}
	</div>
	<div class="grid-container" bind:clientWidth={galleryWidth}>
		{#each dividedItems as column}
			<div class="column">
				{#each column as element (element.id)}
					<div class="element-container">
						{#if element?.image}
							<a href={linkHandler(`/directories/detail/${element.id}`)}>
								<img
									src={`${ASSET_URL}${element?.image.id}==width=430&format=webp`}
									alt={element?.image?.title}
								/>
							</a>
						{/if}
						<a href={linkHandler(`/directories/detail/${element.id}`)}>
							<h4>
								{@html SVGS[element.itemtype.directory]}
								{createLabel(element)}
							</h4>
						</a>
						<div class="meta">
							{element?.itemtype.directory === 'publications'
								? new Date(element?.date).getFullYear()
								: new Date(element?.date).toLocaleDateString(getLocale(), {
										year: 'numeric',
										month: 'numeric',
										day: 'numeric'
									})} | {m[element?.itemtype.directory]({ count: 1 })}
						</div>
					</div>
				{/each}
			</div>
		{/each}
	</div>
</section>

<style lang="scss">
	.mobile-header {
		position: relative;
		@media screen and (min-width: $medium) {
			display: none;
		}
	}
	:global(.bg-image) {
		display: none;
		@media screen and (min-width: $medium) {
			display: block;
		}
	}
	h2 {
		color: $sglg-orange;
	}
	.description {
		font-family: $title-font;
		font-weight: normal;
		:global(strong) {
			font-weight: normal;
		}
		font-size: 19px;
		@media screen and (min-width: $medium) {
			font-size: 26px;
		}
	}

	.grid-container {
		grid-column: 1/-1;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		grid-gap: 1em;
		@media screen and (min-width: $medium) {
			grid-gap: 2em;
		}
	}
	.column {
		display: grid;
		grid-gap: 1em;
		height: fit-content;
	}

	.element-container {
		margin-top: 2em;
		img {
			display: block;
			max-width: 100%;
			margin-bottom: 0.5em;
		}
		:global(svg) {
			width: 22px;
			fill: $dark-green;
			margin-right: 0.5em;
		}
		:global(a) {
			color: $sglg-orange;
			text-decoration: none;
		}
		.meta {
			margin-top: 0.5em;
		}
	}
</style>
