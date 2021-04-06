<script>
	import {locale } from 'svelte-i18n';

	export let segment;
	export let location = 'header';

	let pages = [
		{name: "home", slug: ""},
		{name: 'directory', slug: 'directory', subPages: [
				{name: 'Call for Papers', slug: 'call-for-papers'}
		]},
		{name: "imprint", slug:"imprint"},
		{name: "about", slug:"about"},
		]
</script>

<nav class={location}>
	<ul class="pages">
	{#each pages as page}
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
				margin-top: 1em;
				list-style-type: disc;
			}
		}
	}
</style>
