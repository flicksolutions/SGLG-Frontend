<script context="module">
    import { directus, hydrateTranslations, replaceTranslations } from '../../functions';
    export async function preload({ params }) {
        const content = replaceTranslations(await directus.items('pages').readMany({
            filter: {slug: {"_eq": params.slug}},
            ...hydrateTranslations(["*", "content.page_content_id.*", "content.page_content_id.imagegrid_img.directus_files_id"],{},params.lang)
        }),params.lang);
        if (content[0]) {
            return { meta: content[0], content: content[0]?.content.map(c => c.page_content_id) }
        }
        this.error(404, 'Page not found');
    }
</script>

<script>
    import ImageGrid from "../../components/ImageGrid.svelte";
    import {onMount} from "svelte";
    import {getBg, setBg, addAccordionListener} from "../../functions";

    export let meta;
    export let content

    let windowWidth;
    let featuredImg;

    onMount(async () => {
        if (windowWidth > 800) {
            setBg(document.querySelector('body')); // set a new background image for the body
        } else {
            featuredImg = await getBg();
        }
        addAccordionListener(document.querySelectorAll('.accordion-item'));
    });
</script>

<svelte:head>
    <title>{meta.title}</title>
</svelte:head>

<svelte:window bind:innerWidth={windowWidth} />

{#if featuredImg}
    <div style="position: relative"><img src="{featuredImg}?width={windowWidth}" alt="featured" class="featured"></div>
{:else}
    <div class="spacer"></div>
{/if}

<section class="content-layout">
    <h1>{meta.title}</h1>
    <p class="description">{meta.description}</p>
    <div class="content-inner">
        {#each content as element}
            <div class="bottom-line">
                <h2 id="{element.slug}">{element.title}</h2>
                <div>
                {#if element.imagegrid_img.length}
                    <ImageGrid images={element.imagegrid_img} captions={element?.imagegrid_texts.map(t => t.caption)} overlay={element?.imagegrid_texts.map(t => t.overlay)} />
                {/if}
                {#if element.text}
                    <div>{@html element.text}</div>
                {/if}
                </div>
            </div>
        {/each}
    </div>
</section>

<style lang="scss">
    @import "../../style/theme.scss";
    .featured {
    max-width: 100%;
    }
    h1, h2 {
      color: $sglg-orange;
    }
    .description {
      font-family: $title-font;
      font-size: 19px;
      @media screen and (min-width: $medium) {
        font-size: 26px;
      }
    }

    .content-inner {
      grid-column: 1/-1;
    }

    .bottom-line {
      border-bottom: solid 1px $line-grey;
      padding-bottom: 2em;
      &:first-of-type {
        border-top: solid 1px $line-grey;
      }
      @media (min-width: $medium) {
        display: grid;
        grid-template-columns: 3fr 9fr;
      }
      :global(a) {
        display: block;
        margin-bottom: 14px;
      }
    }
</style>