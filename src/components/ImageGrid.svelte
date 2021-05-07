<script>
    import {_} from 'svelte-i18n';
    import { textfit } from 'svelte-textfit';

    export let images;
    export let captions = [];
    export let overlay = [];

    let parent;
</script>

<div class="img-grid">
    {#each images as img, i}
        <div class="img">
            <a href={`https://backend.ruralhistory.ch/assets/${img.directus_files_id}`} target="_blank">
                <img src={`https://backend.ruralhistory.ch/assets/${img.directus_files_id}?key=detail`} alt={$_('Detailimage')}>
                {#if overlay[i]}<div class="overlay" bind:this={parent} ><div class="inner" use:textfit={{height: 190}}>{@html overlay[i]}</div></div>{/if}
            </a>
            {#if captions[i]}
                <div>{@html captions[i]}</div>
            {/if}
        </div>
    {/each}
</div>

<style lang="scss">
  @import "../style/theme.scss";
  .img-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, 200px);
    grid-gap: 1em;
    justify-content: space-between;
    margin-top: 3em;
    @media (min-width: $medium) {
      grid-column: 2;
    }
    .img {
      a {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        width: 200px;
        height: 200px;
        text-decoration: none;
        &>* {
          grid-column: 1;
          grid-row: 1;
        }
        img {
            opacity: 1;
          transition-property: opacity;
          transition-duration: 200ms;
          transition-timing-function: ease-in-out;
        }
        .overlay{
          opacity: 0;
          transition-property: opacity;
          transition-duration: 200ms;
          transition-timing-function: ease-in-out;
          .inner {
            margin: 5px;
          }
        }
        &:hover {
          img {
            opacity: 0.4;
          }
          .overlay{
            opacity: 1;
            z-index: 9;
          }
        }
      }
    }
  }
</style>