<script>
	import {locale, _} from 'svelte-i18n';
	import {onMount} from 'svelte';
	import Langswitch from "./Langswitch.svelte";
	import Icon from 'fa-svelte';
	import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
	import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'

	export let segment;
	export let location = 'header';

	let icon = faTimes;


	let showMobileMenu = location !== 'header';

	// Media match query handler
	const mediaQueryHandler = e => {
		// Reset mobile state
		if (!e.matches) {
			showMobileMenu = false;
		}
	};

	let pages = [
		{name: "home", slug: ""},
		{name: 'directory', slug: 'directory', subPages: [
				{name: 'Call for Papers', slug: 'call-for-papers'}
		]},
		{name: "imprint", slug:"imprint"},
		{name: "about", slug:"about"},
		]

	// Attach media query listener on mount hook
	onMount(() => {
		const mediaListener = window.matchMedia("(max-width: 767px)");
		mediaListener.addEventListener("change", mediaQueryHandler);
	});
</script>

<nav>
	{#if showMobileMenu}
		<div class="mobile {location}">
			{#if location === 'header'}
				<button class="noButtonStyles close" on:click={() => showMobileMenu = !showMobileMenu}><Icon icon={faTimes}></Icon></button>
			{/if}
			<div class="inner">

				<div class="branding-{location}">
					{#if location !== 'header'}
						<img src="svg/SGLG-Logo.svg" style="max-width: 10em;" alt="Logo" />
					{/if}
					<div class="titles">
						<p>Schweizerische Gesellschaft für ländliche Geschichte</p>
						<p>Société suisse d’histoire rurale</p>
						<p>Società svizzera di storia rurale</p>
						<p>Swiss Rural History Society</p>
					</div>
				</div>
				<div class="langswitch-{location}">
					<Langswitch />
				</div>
				<div class="pages">
				{#each pages as page}
					<div class="page">
						<a aria-current="{segment === page.slug ? 'page' : undefined}" href="{$locale}/{page.slug}">{page.name}</a>
						{#if page.subPages}
						<ul>
							{#each page.subPages as subpage}
								<li><a aria-current="{segment === subpage.slug ? 'page' : undefined}" href="{$locale}/{subpage.slug}">{subpage.name}</a></li>
							{/each}
							<!--<li><a aria-current="{segment === undefined ? 'page' : undefined}" href="{$locale}">home</a></li>
							<li><a aria-current="{segment === 'about' ? 'page' : undefined}" href="{$locale}/about">about</a></li>
							<li><a aria-current="{segment === 'imprint' ? 'page' : undefined}" href="{$locale}/imprint">imprint</a></li>

							 for the blog link, we're using rel=prefetch so that Sapper prefetches
								 the blog data when we hover over the link or tap it on a touchscreen
							<li><a rel=prefetch aria-current="{segment === 'blog' ? 'page' : undefined}" href="blog">blog</a></li>-->
						</ul>
						{/if}
					</div>
				{/each}
				</div>
			</div>
		</div>
	{:else }
		<button class="noButtonStyles" on:click={() => showMobileMenu = !showMobileMenu}>
			<Icon icon={faBars}></Icon>
		</button>
	{/if}
</nav>

<style lang="scss">
	@import "../style/theme.scss";
	.langswitch-footer {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
	.branding-footer {
		display: grid;
		grid-template-columns: 1fr 1fr;
		p {
			text-align: left;
			&:first-of-type {
				margin-top: 0;
			}
		}
		img {
			width: 60%;
		}
	}
	.noButtonStyles {
		font-size: 40px;
		text-align: right;
		padding: 0;
		margin: 0;
		background: none;
		border: none;
		float: right;
	}
	.close {
		position: absolute;
		right: $gutter;
		top: $gutter;
	}
	nav {
		font-weight: 300;
		color: $dark-green;
	}

	.inner {
		@include gutters;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 30% min-content auto;
		height: 100%;
	}
	.header {
		position: absolute;
		width: 100%;
		height: 100vh;
		left: 0;
		top: 0;
	}
	.mobile {

		background-color: $bg-grey;
		.titles {
			margin: 0 auto;
			max-width: 200px;
			text-align: center;
			font-family: $text-font;
		}
	}

	.pages {
		display: grid;
		grid-template-columns: 1fr 1fr;
		ul {
			list-style-position: inside;
			padding: 0;
		}
		a {
			text-decoration: none;
			padding: 1em 0;
			//display: block;
			color: $dark-green;
			&[aria-current="page"] {
				text-decoration: underline;
				text-underline-offset: 6px;
			}
		}
	}



	/* clearfix */
	/*
	ul {
		margin: 0;
		padding: 0;
	}
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}*/

	/*[aria-current] {
		position: relative;
		display: inline-block;
	}

	[aria-current]::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(255,62,0);
		display: block;
		bottom: -1px;
	}*/
</style>
