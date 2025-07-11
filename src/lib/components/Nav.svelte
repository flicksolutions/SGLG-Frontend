<script>
	import { run, createBubbler } from 'svelte/legacy';
	import { building } from '$app/environment';

	const bubble = createBubbler();
	import { m } from '$lib/paraglide/messages.js';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { page as pageStore } from '$app/state';

	/**
	 * @typedef {Object} Props
	 * @property {string} [segment]
	 * @property {string} [location]
	 * @property {any} [pages]
	 */

	/** @type {Props} */
	let { segment = $bindable(''), location = 'header', pages = [] } = $props();
	let activeNews = $derived(!building ? pageStore.url?.searchParams?.get('news') === '' : '');

	const slugify = (s) => s.toLowerCase().replace(' ', '-');

	const capitalize = (w) => w[0].toUpperCase() + w.substring(1);
	run(() => {
		if (segment === undefined) segment = '';
	});
	let menu = [
		{ title: capitalize(m.home()), slug: '' },
		{
			title: capitalize(m.directories({ count: 1 })),
			slug: 'directories',
			subPages: [
				{
					title: capitalize(m.call_for_papers({ count: 2 })),
					slug: '?cat[]=call_for_paper'
				},
				{
					title: capitalize(m.publications({ count: 2 })),
					slug: '?cat[]=publications'
				},
				{ title: capitalize(m.review({ count: 2 })), slug: '?cat[]=review' },
				{ title: capitalize(m.event({ count: 2 })), slug: '?cat[]=event' }
			]
		},
		...pages,
		{ title: capitalize(m.newsletter()), slug: 'directories?news' }
	];
</script>

<nav class={location}>
	<ul class="pages">
		{#each menu as page}
			<li class="page">
				<a
					rel="prefetch"
					aria-current={activeNews
						? page.slug === 'directories?news'
							? 'page'
							: undefined
						: segment === page.slug
							? 'page'
							: undefined}
					href={localizeHref(`/${page.slug}`)}
					onclick={bubble('click')}
				>
					{page.title}
				</a>
				{#if page.subPages}
					<ul>
						{#each page.subPages as subpage}
							<li>
								<a
									rel="prefetch"
									aria-current={segment === subpage.slug ? 'page' : undefined}
									href={localizeHref(
										`/${page.slug}${subpage.slug[0] === '?' ? '' : '#'}${subpage.slug}`
									)}
									onclick={bubble('click')}>{subpage.title}</a
								>
							</li>
						{/each}
					</ul>
				{/if}
			</li>
		{/each}
	</ul>
</nav>

<style lang="scss">
	nav {
		font-weight: 300;
		color: $dark-green;
		li {
			white-space: nowrap;
		}
		&.header {
			.pages {
				display: grid;
				grid-template-columns: 1fr 1fr;
				grid-auto-columns: 1fr;
				ul {
					@media (min-width: $medium) {
						display: none;
					}
					ul {
						padding: 1em 0.5em 0.5em 0.5em;
					}
				}
				.page {
					@media (min-width: $medium) {
						grid-row: 1;
						grid-auto-flow: column;
					}
				}
				.page:hover ul {
					display: block;
					padding-right: 0.5em;
					padding-left: 0.5em;
					@media (min-width: $medium) {
						position: absolute;
					}
				}
			}
		}
		&.footer {
			.pages {
				/*display: flex;
				flex-wrap: wrap;
				justify-content: flex-end;*/
				display: grid;
				justify-content: end;
				grid-template-columns: repeat(auto-fit, 200px);
				ul {
					padding-left: 0;
				}

				.page {
					ul {
						background: none;
					}
				}
			}
		}
	}
	.pages {
		grid-gap: 1em;
		list-style: none;
		padding: 0;
		@media (min-width: $medium) {
			grid-template-columns: initial;
		}
		ul {
			list-style-position: inside;
			padding: 0;
		}
		a {
			text-decoration: none;
			padding: 1em 0;
			color: $dark-green;
			white-space: nowrap;
			&[aria-current='page'] {
				text-decoration: underline;
				text-underline-offset: 6px;
			}
		}
		.page {
			@media (min-width: $medium) {
				margin: 0 1em;
			}
			ul {
				padding-top: 1em;
				list-style-type: disc;
				background-color: $light-green;
				a {
					padding: 0;
				}
			}
		}
	}
</style>
