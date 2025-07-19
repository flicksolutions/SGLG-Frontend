<script>
	import { onMount } from 'svelte';
	import Sticker from '$lib/components/Sticker.svelte';
	import { directus, createLabel } from '$lib/functions';
	import { SVGS } from '$lib/constants';
	import { truncate } from 'htmlsave';
	import { getLocale } from '$lib/paraglide/runtime';
	import { readSingleton } from '@directus/sdk';
	import { m } from '$lib/paraglide/messages';
	import { linkHandler } from '$lib/functions';
	import { page } from '$app/state';

	let { data } = $props();
	let { disturberLabel, disturberLink, items, content, randomIndex } = data;

	let windowWidth = $state(0);
</script>

<svelte:window bind:innerWidth={windowWidth} />

<svelte:head>
	<title>{m.SGLG()}</title>
</svelte:head>

<div class="mobile-header">
	<Sticker label={disturberLabel} link={disturberLink} /><img
		src={page.data?.bgUrl[randomIndex]}
		alt="featured"
		class="featured"
	/>
</div>
<div class="spacer"><Sticker label={disturberLabel} link={disturberLink} /></div>

<section class="content-layout">
	<h2>
		{m.news()}
		{#if windowWidth > 600}
			<br /><span class="internal">{m.SGLG()}</span>
		{/if}
	</h2>
	<div class="list">
		<ol>
			{#each items as item}
				<li class:internal={item.internal}>
					<a
						href={linkHandler(
							`/directories/detail/${item?.references?.[0]?.entities_related_id?.id ?? item.id}`
						)}
						class={item.itemtype.directory}
					>
						{#if SVGS[item.itemtype.directory]}
							{@html SVGS[item.itemtype.directory]}
						{/if}
						<h2>{createLabel(item)}</h2>
					</a>
					<div class="meta">
						{#if item.date}
							<p>
								{item.itemtype.directory === 'publications'
									? new Date(item.date).getFullYear()
									: new Date(item.date).toLocaleDateString(getLocale(), {
											year: 'numeric',
											month: 'numeric',
											day: 'numeric'
										})}
							</p>
						{/if}
						<p>{m[item.itemtype.directory]({ count: 1 })}</p>
					</div>
					{#if item.content}
						<div class="content">
							{@html truncate(item.content, 250)}
						</div>
					{/if}
				</li>
			{/each}
		</ol>
		<a class="button" href={linkHandler(`/directories`)}>{m.all_entries()}</a>
	</div>
</section>
{#each content as block}
	<section class:colorful={block.style} class="content-block">
		<div>
			<h3>{block.title}</h3>
			{@html block.content}
		</div>
	</section>
{/each}

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
	.featured {
		max-width: 100%;
	}
	ol {
		padding: 0;
		list-style: none;
		li {
			border-top-color: $line-grey;
			border-top-style: solid;
			border-top-width: thin;
			padding-top: 0.6em;
			margin-top: 1.5em;
			a:first-child {
				color: $dark-green;
				text-decoration: none;
				h2 {
					margin: 0 0 0.2em 0;
				}
			}
			.meta {
				display: grid;
				grid-auto-flow: column;
				justify-content: flex-start;
				p {
					color: $dark-green;
					margin: 0;
					&:not(:last-child) {
						border-right: solid;
						border-right-width: thin;
						margin-right: 0.5em;
						padding-right: 0.5em;
					}
				}
			}
			&.internal {
				a:first-child,
				:global(a img) {
					color: $sglg-orange;
					fill: $sglg-orange;
				}
			}
		}
	}

	a :global(svg) {
		margin-right: 0.6em;
		width: 22px;
		display: block;
		float: left;
		fill: $dark-green;
	}
</style>
