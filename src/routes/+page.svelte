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

	let items = $state([]);
	let content = $state([]);
	let windowWidth = $state(0);

	//get the content
	let fields = [
		'content',
		'items.id',
		'items.internal',
		'items.references.entities_related_id.title',
		'items.references.entities_related_id.id',
		'items.references.entities_related_id.person',
		'items.references.entities_related_id.internal',
		'items.itemtype.directory',
		'items.content',
		'items.title',
		'items.person',
		'items.date',
		'items.event_type',
		'items.publication_type'
	];
	let deep = { items: { _sort: '-date' } };
	if (getLocale() !== 'de') {
		// if we are not in default locale, we need to get the translations of the items
		fields.push('translations.content', 'items.translations.title', 'items.translations.content');
		const trans = {
			_filter: {
				languages_code: {
					_eq: getLocale()
				}
			}
		};
		deep.items.translations = trans;
		deep.translations = trans;
	}

	directus.request(readSingleton('homepage', { fields, deep })).then((json) => {
		items = json.items.map((i) => {
			//we set the items to display on the page. For that we consume the items from the response.
			let cleanItem = {
				//it may look funny to fiddle around with the items. but the reason is translation. I do this here because I want my html nice and understandable.
				...i,
				...i.translations?.[0] //but also replace any translatable fields with the translated ones.
			};
			if (i.references[0]?.entities_related_id?.title) {
				cleanItem.title = m[`${i.itemtype.directory}_title`]({
					title: i.references[0].entities_related_id.title
				});
				cleanItem.internal = i.references[0].entities_related_id.internal;
			}
			return cleanItem;
		});
		if (getLocale() !== 'de' && json.translations[0]?.content) {
			content = json.translations[0].content;
		} else {
			content = json.content;
		}
	});
	const randomIndex = Math.floor(Math.random() * page.data?.bgUrl.length);
</script>

<svelte:window bind:innerWidth={windowWidth} />

<svelte:head>
	<title>{m.SGLG()}</title>
</svelte:head>

<div class="mobile-header">
	<Sticker /><img src={page.data?.bgUrl[randomIndex]} alt="featured" class="featured" />
</div>
<div class="spacer"><Sticker /></div>

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
