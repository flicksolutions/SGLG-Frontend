<script>
	import { _ } from 'svelte-i18n';
</script>


<svelte:head>
	<title>Sapper project template</title>
</svelte:head>

<h1>Great success!{$_('page_title')}</h1>

<figure>
	<figcaption>Have fun with Sapper!</figcaption>
</figure>

<p><i>this should be red</i><strong>Try editing this file (src/routes/index.svelte) to test live reloading.</strong></p>

<style lang="scss">
	h1, figure, p {
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		text-transform: uppercase;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	figure {
		margin: 0 0 1em 0;
	}

	img {
		width: 100%;
		max-width: 400px;
		margin: 0 0 1em 0;
	}

	p {
		margin: 1em auto;
		i {
			color: red;
		}
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>