<script>
	import Nav from "./Nav.svelte";
	import Langswitch from "./Langswitch.svelte";
	export let segment;
</script>

<footer>
	<div class="menu">
		<div class="inner">
			<div class="branding">
				<img src="svg/SGLG-Logo.svg" style="max-width: 10em;" alt="Logo" />
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
			<!--<Nav {segment} location="footer"/>-->
		</div>
	</div>
</footer>

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
	.branding-header, .langswitch-header {
		@media (min-width: $medium) {
			display: none;
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
		@media (min-width: $medium) {
			display: none;
		}
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
	.footer {
		@media (min-width: $medium) {
			.langswitch-footer {
				grid-row: 2;
			}
			.inner{
				grid-template-columns: 3fr 2fr;
				.pages {
					grid-auto-flow: column;
				}
			}
		}

	}
	.inner {
		@include gutters;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 30% min-content auto;
		height: 100%;
	}
	.menu {
		background-color: $bg-grey;
		@media (min-width: $medium) {
			background: none;
		}
		.titles {
			margin: 0 auto;
			max-width: 280px;
			text-align: center;
			font-family: $text-font;
		}
	}
</style>