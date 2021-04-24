<script>
    import InlineSVG from 'svelte-inline-svg';

    export let value;
    export let checked = false;
    export let customEvent = false;
    export let cssClass;

    const rnd = Math.floor(Math.random() * 1000);
</script>

<input type="checkbox" id={`chk-${rnd}`} value checked={checked}>
{#if customEvent}
<label for={`chk-${rnd}`} on:click|preventDefault class={cssClass}>
    <InlineSVG src={'/svg/x.svg'} class="chk-icon"/><slot></slot></label>
{:else}
<label for={`chk-${rnd}`} class={cssClass}><InlineSVG src={'/svg/x.svg'} class="chk-icon"/><slot></slot></label>
{/if}

<style lang="scss">
  @import "../../../style/theme.scss";
  input[type=checkbox] {
    display: none;
    & + label {
      :global(.chk-icon) {
        display: none;
      }
      &:before {
        content: "";
        border: 1px solid $line-grey;
        width: 14px;
        height: 14px;
        display: block;
        float: left;
        margin: 4px 5px 0 0;
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