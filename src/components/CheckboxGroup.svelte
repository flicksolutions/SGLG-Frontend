<script>
    import InlineSVG from 'svelte-inline-svg';
    import { SVGS } from '../constants';
    import { _ } from 'svelte-i18n';

    export let checkboxes = []
    export let group = []

    const rnd = Math.floor(Math.random() * 10);
</script>
{ #each checkboxes as checkbox }
    <input type="checkbox" id={`chk-${checkbox.label}-${rnd}`} bind:group value={checkbox.value}>
    <label for={`chk-${checkbox.label}-${rnd}`}>
        <InlineSVG src={'/svg/x.svg'} class="chk-icon"/>
        <InlineSVG src={SVGS[checkbox.value]} class="svg"/>{$_(checkbox.label, {values: {n:2}})}</label>
{/each}