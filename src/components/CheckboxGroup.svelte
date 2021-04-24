<script>
    import InlineSVG from 'svelte-inline-svg';

    export let checked = false
    export let checkboxes = []
    export let group = []

    const rnd = Math.floor(Math.random() * 10);
</script>
{ #each checkboxes as checkbox }
    <input type="checkbox" id={`chk-${checkbox.label}-${rnd}`} bind:group value={checkbox.value}>
    <label for={`chk-${checkbox.label}-${rnd}`}><InlineSVG src={'/svg/x.svg'} class="svg"/>{checkbox.label}</label>
{/each}

<style lang="scss">
  @import "../style/theme.scss";
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