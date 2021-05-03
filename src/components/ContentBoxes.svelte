<script>
    import { _ } from 'svelte-i18n';

    export let content = {};
</script>

{#each Object.entries(content) as [title, val]}
    <div class="top-line">
    {#if !Array.isArray(val) && val}
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
    {:else if Array.isArray(val) && val[0]}
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
    {/if}
    </div>
{/each}


<style lang="scss">
  @import "../../../style/theme.scss";
    * {
      color: $dark-green;
    }
  .top-line {
    border-top: solid 1px $line-grey;
  }
</style>