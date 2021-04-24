<script>
    import InlineSVG from 'svelte-inline-svg';
    import { SVGS } from '../constants';

    export let checkboxes = []
    export let group = []

    const rnd = Math.floor(Math.random() * 10);
</script>
{ #each checkboxes as checkbox }
    <input type="checkbox" id={`chk-${checkbox.label}-${rnd}`} bind:group value={checkbox.value}>
    <label for={`chk-${checkbox.label}-${rnd}`}>
        <InlineSVG src={'/svg/x.svg'} class="chk-icon"/>
        <InlineSVG src={SVGS[checkbox.value]} class="svg"/>{checkbox.label}</label>
{/each}

<style lang="scss">
  @import "../style/theme.scss";
  input[type=checkbox] {
    display: none;
    & + label {
      :global(.chk-icon) {
        display: none;
      }
      :global(.svg) {
        margin: 0 0.6em;
        width: 22px;
        display: block;
        float: left;
        fill: $dark-green;
      }
      &:before {
        content: "";
        border: 1px solid $line-grey;
        width: 14px;
        height: 14px;
        display: block;
        float: left;
        margin: 4px 0 0 0;
        //margin-right: 5px;
      }
    }
    &:checked + label :global(.chk-icon) {
      display: block;
      position: absolute;
      margin: 7px 0 0 1.5px;
      stroke-width: 3;
      width: 13px;
    }
  }
</style>