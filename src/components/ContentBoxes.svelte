<script>
    import { _ } from 'svelte-i18n';

    export let content = {};
</script>

{#each Object.entries(content) as [title, val]}
    {#if !Array.isArray(val) && val}
    <div class="bottom-line">
        <h3>{$_(title)}</h3>
        {#if title.includes('date')}
            <p>&#8594; {val}</p>
        {:else if title.includes('content')}
            {@html val}
        {:else if typeof val === 'string'}
            <p>{val}</p>
        {:else}
            <p>{JSON.stringify(val)}</p>
        {/if}
    </div>
    {:else if Array.isArray(val) && val[0]}
    <div class="bottom-line">
        <h3>{$_(title)}</h3>
        {#if title.includes('link')}
            {#each val as arVal}
                {@html arVal}
            {/each}
        {:else}
            {#each val as arVal}
                <p>{arVal}</p>
            {/each}
        {/if}
    </div>
    {/if}

{/each}


<style lang="scss">
  @import "../../../style/theme.scss";
    *, :global(a) {
      color: $dark-green;
    }
  .bottom-line {
    border-bottom: solid 1px $line-grey;
    &:first-of-type {
      border-top: solid 1px $line-grey;
    }
  }
  :global(a) {
    display: block;
    margin-bottom: 14px;
  }
</style>