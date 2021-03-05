<script>
	import { locale, locales } from 'svelte-i18n';

	const setLocale = (target) => {
		$locale = target;
	}
</script>

<footer>
	<img src="svg/SGLG-Logo.svg" style="max-width: 10em;">
	<div>
		<p>Schweizerische Gesellschaft für ländliche Geschichte</p>
		<p>Société suisse d’histoire rurale</p>
		<p>Società svizzera di storia rurale</p>
		<p>Swiss Rural History Society</p>
	</div>
	<ul class="langswitch">
		{#each $locales as locale}
			<li><a href="" on:click|preventDefault={() => setLocale(locale)}>{locale}</a></li>
		{/each}
	</ul>
</footer>
