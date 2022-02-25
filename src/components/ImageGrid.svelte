<script>
    import { textfit } from 'svelte-textfit';
    import Lightbox from "./Lightbox.svelte";

    export let images;
    export let captions = [];
    export let overlay = [];
    const showLightbox = new Array(images.length).fill(false)
    let parent;
</script>

<div class="img-grid">
    {#each images as img, i}
        <figure class="img">
            <a href={`https://backend.ruralhistory.ch/assets/${img.directus_files_id.id}`} on:click|preventDefault={() => showLightbox[i] = !showLightbox[i]} target="_blank">
                <img src={`https://backend.ruralhistory.ch/assets/${img.directus_files_id.id}?key=detail`} alt={img.directus_files_id.title}>
                {#if overlay[i]}<div class="overlay" bind:this={parent} ><div class="inner" use:textfit={{height: 200}}>{@html overlay[i]}</div></div>{/if}
            </a>
            {#if captions[i]}
                <figcaption>{@html captions[i]}</figcaption>
            {/if}
        </figure>
        {#if showLightbox[i]}
            <Lightbox img={`https://backend.ruralhistory.ch/assets/${img.directus_files_id.id}`} alt={img.directus_files_id.title} on:exitLightbox={() => showLightbox[i] = !showLightbox[i]} />
        {/if}
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
        color: $dark-green;
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
        .overlay {
          opacity: 0;
          transition-property: opacity;
          transition-duration: 200ms;
          transition-timing-function: ease-in-out;

          .inner {
              :global(p) {
                margin: 0;
                font-size: inherit;
                font-family: $title-font;
                font-weight: normal;
              }
            strong {
              font-weight: normal;
            }
        }
        }
        &:hover {
          img {
            opacity: 0.1;
          }
          .overlay{
            opacity: 1;
            z-index: 9;
          }
        }
      }
      figcaption :global(a){
        margin-bottom: unset;
      }
    }
  }
</style>