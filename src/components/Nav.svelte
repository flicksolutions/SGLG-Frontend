<script>
	import {locale, _ } from 'svelte-i18n';

	export let segment;
	export let location = 'header';
	export let pages = [];

	const slugify = s => s.toLowerCase().replace(' ','-');

	let menu = [
		{name: $_('home'), slug: ""},
		{name: 'directories', slug: 'directories', subPages: [
				{name: $_('call for papers'), slug: 'directories?cat[]=call_for_paper'},
				{name: $_('publications'), slug: 'directories?cat[]=publications'},
				{name: $_('review'), slug: 'directories?cat[]=review'},
				{name: $_('event'), slug: 'directories?cat[]=event'},
		]},
			...pages.map(t => ({name: t, slug: slugify(t)})),
		]
</script>
<nav class={location}>
	<ul class="pages">
	{#each menu as page}
		<li class="page">
			<a aria-current="{segment === page.slug ? 'page' : undefined}" href="{$locale}/{page.slug}">{page.name}</a>
			{#if page.subPages}
			<ul>
				{#each page.subPages as subpage}
					<li><a aria-current="{segment === subpage.slug ? 'page' : undefined}" href="{$locale}/{subpage.slug}">{subpage.name}</a></li>
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
					position: absolute;
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
