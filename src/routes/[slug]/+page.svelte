<script>
	import ImageGrid from '$lib/components/ImageGrid.svelte';
	import { onMount } from 'svelte';
	import { addAccordionListener } from '$lib/functions';
	import { m } from '$lib/paraglide/messages';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
	let meta = $derived(data.meta);
	let content = $derived(data.content);
	let randomIndex = $derived(data.randomIndex);

	onMount(async () => {
		addAccordionListener(document.querySelectorAll('.accordion-item'));
	});
</script>

<svelte:head>
	<title>{meta.title}</title>
</svelte:head>

<div class="mobile-header">
	<img src={data?.bgUrl[randomIndex]} alt="featured" class="featured" />
</div>
<div class="spacer"></div>

<section class="content-layout">
	<h1>{meta.title}</h1>
	<div class="description">{@html meta.description || ''}</div>
	<div class="content-inner">
		{#each content as element}
			<div class="bottom-line">
				<h2 id={element.slug}>{element.title}</h2>
				<div>
					{#if element?.imagegrid_img?.length}
						<ImageGrid
							images={element.imagegrid_img}
							captions={element?.imagegrid_texts.map((t) => t.caption)}
							overlay={element?.imagegrid_texts.map((t) => t.overlay)}
						/>
					{/if}
					{#if element.text}
						<div>{@html element.text}</div>
					{/if}
				</div>
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
	h1,
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

	.content-inner {
		grid-column: 1/-1;
	}

	.bottom-line {
		border-bottom: solid 1px $line-grey;
		padding-bottom: 2em;
		&:first-of-type {
			border-top: solid 1px $line-grey;
		}
		@media (min-width: $medium) {
			display: grid;
			grid-template-columns: 3fr 9fr;
		}
		:global(a) {
			display: block;
			margin-bottom: 14px;
		}
		.member-list {
			display: grid;
			padding-left: 1em;
			column-gap: 1.5rem;
			row-gap: 0.5rem;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			li {
				a {
					display: inline;
					margin-bottom: inherit;
				}
			}
		}
	}
</style>
