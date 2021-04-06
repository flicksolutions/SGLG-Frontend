<script>
	import Nav from "./Nav.svelte";
	import Langswitch from "./Langswitch.svelte";
	export let segment;
</script>

<footer>
	<div class="menu">
		<div class="inner">
			<div class="branding">
				<img src="svg/SGLG-Logo.svg" alt="Logo" />
				<div class="titles">
					<p>Schweizerische Gesellschaft für ländliche Geschichte</p>
					<p>Société suisse d’histoire rurale</p>
					<p>Società svizzera di storia rurale</p>
					<p>Swiss Rural History Society</p>
				</div>
			</div>
			<div class="langswitch">
				<Langswitch  {segment} />
			</div>
			<Nav {segment} location="footer" />
		</div>
	</div>
</footer>

<style lang="scss">
	@import "../style/theme.scss";
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
		img {
			width: 60%;
		}
		@media (min-width: $medium) {
			display: contents;
		}
	}
	.inner {
		@include gutters;
		@include max-width;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 30% min-content auto;
		height: 100%;
		@media (min-width: $medium) {
			grid-template-columns: 3fr 4fr 5fr;
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