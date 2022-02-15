<script>
	import {locale, _ } from 'svelte-i18n';
	import { prefetch } from '@sapper/app';


	export let segment;
	export let location = 'header';
	export let pages = [];

	const slugify = s => s.toLowerCase().replace(' ','-');

	let menu = [
		{title: $_('home'), slug: ""},
		{title: $_('directories', {values: {n:4}}), slug: 'directories', subPages: [
				{title: $_('call for papers', {values: {n:2}}), slug: '?cat[]=call_for_paper'},
				{title: $_('publications', {values: {n:2}}), slug: '?cat[]=publications'},
				{title: $_('review', {values: {n:2}}), slug: '?cat[]=review'},
				{title: $_('event', {values: {n:2}}), slug: '?cat[]=event'},
		]},
		...pages,
		{title: $_('news'), slug: "directories?news"},
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
			&[aria-current="page"] {
				text-decoration: underline;
				text-underline-offset: 6px;
			}
		}
		.page{
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
