<script>
	import { m } from '$lib/paraglide/messages.js';
	import { linkHandler } from '$lib/functions';
	import { SVGS } from '$lib/constants';
	import { createLabel } from '$lib/functions';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
	const { items } = data;
</script>

<svelte:head>
	<title>{m.highlights_title()}</title>
</svelte:head>

<div class="mobile-header">
	<img src={data?.bgUrl} alt="featured" class="featured" />
</div>
<div class="spacer"></div>

<section class="content-layout">
	<h2>{m.highlights_title()}</h2>
	<div class="description">
		<h3>Erfahren Sie mehr darüber, was die SGLG bietet.</h3>
		<p>
			Hier finden Sie einen Auszug von Aktivitäten der SGLG, Exkursionen, von uns veranstaltete
			Tagungen sowie die wichtigsten Publikationen von Mitgliedern unserer Gesellschaft.
		</p>
	</div>
	<div class="content-inner">
		<div>
			{#each items as element}
				<div class="bottom-line">
					{@html SVGS[element.itemtype.directory]}<a
						href={linkHandler(`/directory/detail/${element.id}`)}>{createLabel(element)}</a
					>
					<div></div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style lang="scss">
	.content-inner :global(svg) {
		width: 22px;
	}
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
	.featured {
		max-width: 100%;
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
	}
</style>
