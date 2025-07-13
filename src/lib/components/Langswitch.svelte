<script>
	import { locales, getLocale, setLocale } from '$lib/paraglide/runtime';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { linkHandler } from '$lib/functions';

	function serialize(obj) {
		var str = [];
		for (var p in obj) {
			if (p) {
				str.push(`${encodeURIComponent(p)}${obj[p] && '=' + encodeURIComponent(obj[p])}`);
			}
		}
		return str.join('&');
	}
</script>

<ul class="langswitch">
	{#each locales as lang}
		<li>
			<a
				href={linkHandler(`/${page.url.pathname.split('/').filter(Boolean).pop()}`, lang)}
				class:selected={lang === getLocale()}
				on:click|preventDefault={() => setLocale(lang)}>{lang.toUpperCase()}</a
			>
		</li>
	{/each}
</ul>

<style lang="scss">
	.langswitch {
		list-style: none;
		padding: 0;
		display: flex;
		justify-content: center;
	}
	li {
		&:first-child {
			a {
				padding-left: 0;
			}
		}
		&:last-child {
			a {
				padding-right: 0;
			}
		}
		a {
			color: inherit;
			text-decoration: none;
			padding: 0 0.8em;
			text-underline-offset: 4px;
			font-size: 1em;

			&.selected {
				text-decoration: underline;
			}
		}
	}
</style>
