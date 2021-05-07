<script>
	import {locale, _ } from 'svelte-i18n';
	import { prefetch } from '@sapper/app';


	export let segment;
	export let location = 'header';
	export let pages = [];

	const slugify = s => s.toLowerCase().replace(' ','-');

	let menu = [
		{title: $_('home'), slug: ""},
		{title: $_('directories'), slug: 'directories', subPages: [
				{title: $_('call for papers'), slug: '?cat[]=call_for_paper'},
				{title: $_('publications'), slug: '?cat[]=publications'},
				{title: $_('review'), slug: '?cat[]=review'},
				{title: $_('event'), slug: '?cat[]=event'},
		]},
			...pages,
		];
</script>
<nav class={location}>
	<ul class="pages">
	{#each menu as page}
		<li class="page">
			<a rel=prefetch aria-current="{segment === page.slug ? 'page' : undefined}" href="{$locale}/{page.slug}" on:click on:mouseenter={() => {prefetch(`${$locale}/${page.slug}`)}}>{page.title}</a>
			{#if page.subPages}
			<ul>
				{#each page.subPages as subpage}
					<li><a rel=prefetch aria-current="{segment === subpage.slug ? 'page' : undefined}" href="{$locale}/{page.slug}{subpage.slug[0] === '?' ? '' : '#'}{subpage.slug}" on:click on:mouseenter={() => {prefetch(`${$locale}/${page.slug}`)}}>{subpage.title}</a></li>
				{/each}
			</ul>
			{/if}
		</li>
	{/each}
	</ul>
</nav>

<style lang="scss">
	@import "../style/theme.scss";
	nav {
		font-weight: 300;
		color: $dark-green;
		&.header {
			.pages {
				ul {
					@media (min-width: $medium) {
						display: none;
					}
				}
				.page:hover ul {
					display: block;
					@media (min-width: $medium) {
						position: absolute;
					}
				}
			}
		}
	}
	.pages {
		display: grid;
		grid-template-columns: 1fr 1fr;
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
			&[aria-current="page"] {
				text-decoration: underline;
				text-underline-offset: 6px;
			}
		}
		.page{
			@media (min-width: $medium) {
				grid-row: 1;
				margin: 0 1em;
				grid-auto-flow: column;
			}
			ul {
				padding-top: 1em;
				list-style-type: disc;
				a {
					padding: 0;
				}
			}
		}
	}
</style>
