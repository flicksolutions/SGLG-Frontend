<script>
	import Nav from './Nav.svelte';
	import Langswitch from './Langswitch.svelte';
	import logo from '$lib/svg/SGLG-Logo.svg';
	import { getLocale } from '$lib/paraglide/runtime';

	let { pages, segment } = $props();

	let sggLogo = $derived.by(async () => {
		return await import(`$lib/svg/SGG-sektion-ps-${getLocale()}.svg`).then(
			(module) => module.default
		);
	});
</script>

<footer>
	<div class="menu">
		<div class="inner">
			<div class="branding">
				<img src={logo} alt="Logo" />
				{#await sggLogo then path}
					<img src={path} alt="SGG Logo" class="sgg-logo" />
				{/await}
			</div>
			<div class="langswitch">
				<Langswitch />
			</div>
			<Nav {pages} {segment} location="footer" />
		</div>
	</div>
</footer>

<style lang="scss">
	img.sgg-logo {
		width: 100%;
		max-width: unset;
	}
	.langswitch {
		display: grid;
		grid-template-columns: 1fr 1fr;
		width: min-content;
		@media (min-width: $medium) {
			grid-row: 2;
		}
	}
	.branding {
		display: grid;
		grid-template-columns: 1fr 1fr;
		p {
			text-align: left;
			&:first-of-type {
				margin-top: 0;
			}
		}
		img:not(.sgg-logo) {
			width: 60%;
		}
		@media (min-width: $medium) {
			display: contents;
		}
	}
	.inner {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 30% min-content auto;
		height: 100%;
		& {
			@include max-width;
			@include gutters;
		}
		@media (min-width: $medium) {
			grid-template-columns: 2fr 2fr 5fr;
			//grid-template-columns: 3fr 4fr 5fr;
			grid-template-rows: initial;
		}
	}
	footer {
		background-color: $bg-grey;
		color: $dark-green;
		font-weight: 300;
	}
	.titles {
		margin: 0 auto;
		max-width: 280px;
		text-align: center;
		font-family: $text-font;
		@media (min-width: $medium) {
			margin: 0;
		}
	}

	img {
		max-width: 8em;
	}
</style>
