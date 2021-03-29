<script context="module">
	import { waitLocale } from 'svelte-i18n'

	export async function preload(page) {
		// awaits for the loading of the default dictionaries
		return waitLocale()
	}
</script>


<slot></slot>


<style lang="scss" global>
	@import "./style/global.scss";
</style>