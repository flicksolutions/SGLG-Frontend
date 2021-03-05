<script>
	import Langswitch from './Langswitch.svelte';
	import Nav from "./Nav.svelte";

	export let segment;
</script>

<footer>
	<img src="svg/SGLG-Logo.svg" style="max-width: 10em;" />
	<div>
		<p>Schweizerische Gesellschaft für ländliche Geschichte</p>
		<p>Société suisse d’histoire rurale</p>
		<p>Società svizzera di storia rurale</p>
		<p>Swiss Rural History Society</p>
	</div>
	<Langswitch />
	<Nav {segment} location="footer"/>
</footer>
