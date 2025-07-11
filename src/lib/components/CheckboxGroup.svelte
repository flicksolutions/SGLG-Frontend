<script>
	import { SVGS } from '$lib/constants';
	import { m } from '$lib/paraglide/messages.js';
	import x from '$lib/svg/x.svg';

	export let checkboxes = [
		{
			label: 'call for papers',
			value: 'call_for_paper'
		},
		{
			label: 'publications',
			value: 'publications'
		},
		{
			label: 'review',
			value: 'review'
		},
		{
			label: 'event',
			value: 'event'
		}
	];
	export let group = [];

	const rnd = Math.floor(Math.random() * 10);
</script>

{#each checkboxes as checkbox}
	<input type="checkbox" id={`chk-${checkbox.label}-${rnd}`} bind:group value={checkbox.value} />
	<label for={`chk-${checkbox.label}-${rnd}`}>
		<img src={x} class="chk-icon" alt="checkbox icon" />
		{@html SVGS[checkbox.value]}
		{m[checkbox.label]({ count: 2 })}
	</label>
{/each}
