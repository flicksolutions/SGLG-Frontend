<script>
    import InlineSVG from 'svelte-inline-svg';

    export let value;
    export let label = "label";
    export let checked = false;
    export let customEvent = false

    const rnd = Math.floor(Math.random() * 1000);
</script>

<input type="checkbox" id={`chk-${rnd}`} value checked={checked}>
{#if customEvent}
<label for={`chk-${rnd}`} on:click|preventDefault><InlineSVG src={'/svg/x.svg'} class="svg"/><slot></slot></label>
{:else}
<label for={`chk-${rnd}`}><InlineSVG src={'/svg/x.svg'} class="svg"/><slot></slot></label>
{/if}

<style lang="scss">
  @import "../../../style/theme.scss";
  input[type=checkbox] {
    visibility: hidden;
    & + label {
      :global(.svg) {
        display: none;
      }
      &:before {
        content: "";
        border: 1px solid $line-grey;
        width: 14px;
        height: 14px;
        display: block;
        float: left;
        margin-right: 5px;
      }
    }
    &:checked + label :global(.svg) {
      display: block;
      position: absolute;
      margin: 3.2px 0 0 1.5px;
      stroke-width: 3;
      width: 13px;
    }
  }
</style>