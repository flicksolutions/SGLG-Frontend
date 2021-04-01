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
		<Langswitch {segment} />
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

	}

	p {
		text-align: center;
		margin-top: 0;
	}
</style>

