<script>
	import { SVGS } from '$lib/constants';
	import { m } from '$lib/paraglide/messages.js';
	import x from '$lib/svg/x.svg';

	export let checkboxes = ['call_for_paper', 'publications', 'review', 'event'];
	export let group = [];

	const rnd = Math.floor(Math.random() * 10);
</script>

{#each checkboxes as checkbox}
	<input type="checkbox" id={`chk-${checkbox}-${rnd}`} bind:group value={checkbox} />
	<label for={`chk-${checkbox}-${rnd}`}>
		<img src={x} class="chk-icon" alt="checkbox icon" />
		{@html SVGS[checkbox]}
		{m[checkbox]({ count: 2 })}
	</label>
{/each}
