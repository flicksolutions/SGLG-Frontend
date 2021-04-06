<script>
	import Langswitch from './Langswitch.svelte';
	import Nav from './Nav.svelte';
	import { _ } from 'svelte-i18n';
	import Icon from 'fa-svelte';
	import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
	import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'

	let showMobileMenu = false;


	export let segment;
</script>

<header class:showMobileMenu>
	<div class="inner">
		<img class:invisible={showMobileMenu} src="svg/SGLG-Logo.svg" alt="Logo" />
		<div class="titleLangContainer">
			{#if !showMobileMenu}
				<p>{$_('SGLG')}</p>
			{:else}
				<div class="titles">
					<p>Schweizerische Gesellschaft für ländliche Geschichte</p>
					<p>Société suisse d’histoire rurale</p>
					<p>Società svizzera di storia rurale</p>
					<p>Swiss Rural History Society</p>
				</div>
			{/if}
			<div class="langswitch"><Langswitch {segment} /></div>
		</div>
		<button class="noButtonStyles" class:close={showMobileMenu} on:click={() => showMobileMenu = !showMobileMenu}>
			<Icon icon={showMobileMenu ? faTimes : faBars}></Icon>
		</button>
		<div class="nav"><Nav {segment} location="header"/></div>
	</div>
</header>

<style lang="scss">
	@import "../style/theme.scss";
	header {
		background-color: $light-green;
		&.showMobileMenu {
			background-color: $bg-grey;
			.inner {
				grid-template-columns: 1fr;
				grid-auto-flow: row;
			}
		}
		.inner {
			@include gutters;
			@include max-width;
			display: grid;
			grid-template-columns: 1fr 4fr min-content;
			color: $dark-green;
			@media (min-width: $medium) {
				grid-template-columns: 3fr 4fr 5fr;
				grid-gap: 1em;
			}
		}
	}
	img {
		max-width: 8em;
		@media (min-width: $medium) {
			//display: initial;
		}
	}
	.invisible {
		display: none;
	}

	p {
		text-align: center;
		max-width: 14em;
		margin: 1.1em auto;
		&:first-of-type {
			margin-top: 0;
		}
		@media (min-width: $medium) {
			margin: 0;
			text-align: left;
		}

	}
	.showMobileMenu {
		height: 100vh;
		width: 100vw;
		position: fixed;
		top: 0;
		.langswitch {
			width: min-content;
		}
		.nav {
			display: block;
		}
		.titleLangContainer {
			display: contents;
		}
		.inner {
			grid-template-rows: 30% min-content auto;
			height: 100%;
		}
	}
	.langswitch {
		@media (min-width: $medium) {
			width: min-content;
			//margin-left: -0.8em;
		}
	}
	.noButtonStyles {
		display: flex;
		align-content: start;
		font-size: 40px;
		text-align: right;
		padding: 0;
		margin: 0;
		background: none;
		border: none;
		float: right;
		@media (min-width: $medium) {
			display: none;
		}
	}
	.close {
		position: fixed;
		right: $gutter;
		top: $gutter;
	}
	.nav {
		display: none;
		@media (min-width: $medium) {
			display: block;
		}
	}
</style>

