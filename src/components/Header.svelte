<script>
	import Langswitch from './Langswitch.svelte';
	import Nav from './Nav.svelte';


	export let segment;
</script>

<header>
	<img src="svg/SGLG-Logo.svg" style="max-width: 10em;" alt="Logo" />
	<p>Schweizere Gesellschaft für ländliche Geschichte</p>
	<Nav {segment} location="header" />
	<Langswitch/>
</header>

<style lang="scss">

</style>

