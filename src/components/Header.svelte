<script>
	import Langswitch from './Langswitch.svelte';
	import Nav from './Nav.svelte';
	import { _ } from 'svelte-i18n';


	export let segment;
</script>

<header>
	<img src="svg/SGLG-Logo.svg" style="max-width: 10em;" alt="Logo" />
	<div>
		<p>{$_('SGLG')}</p>
		<div class="langswitch"><Langswitch {segment} /></div>
	</div>
	<Nav {segment} location="header" />
</header>

<style lang="scss">
	@import "../style/theme.scss";
	header {
		background-color: $light-green;
		@include gutters;
		display: grid;
		grid-template-columns: 1fr 3fr min-content;
		color: $dark-green;
		@media (min-width: $medium) {
			grid-template-columns: 1fr 2fr max-content;
			grid-gap: 1em;
		}

	}

	p {
		text-align: center;
		margin-top: 0;
		@media (min-width: $medium) {
			text-align: left;
		}
	}
	.langswitch {
		@media (min-width: $medium) {
			width: min-content;
			margin-left: -0.8em;
		}
	}
</style>

