<script context="module">
    import { directus } from '../../functions';
    export async function preload({ params }) {
        const content = await directus.items('pages').readMany({
            filter: {slug: {"_eq": params.slug}},
            fields: ["*", "content.page_content_id.*", "content.page_content_id.imagegrid_img.directus_files_id"]
        });
        if (content?.data?.[0]) {
            return { meta: content.data[0], content: content.data[0].content.map(c => c.page_content_id) }
        }
        this.error(404, 'Page not found');
    }
</script>

<script>
    import ContentBoxes from '../../components/ContentBoxes.svelte';
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

<svelte:window bind:innerWidth={windowWidth} />

{#if featuredImg}
    <div style="position: relative"><img src="{featuredImg}?width={windowWidth}" alt="featured" class="featured"></div>
{:else}
    <div class="spacer"></div>
{/if}

<section class="content-layout">
    <h1>{meta.title}</h1>
    <p class="description"><strong>{meta.description}</strong></p>
    {#each content as element}
        <h2 id="{element.slug}">{element.title}</h2>
        {#if element.imagegrid_img.length}
            <ImageGrid images={element.imagegrid_img} captions={element?.imagegrid_texts.map(t => t.caption)} overlay={element?.imagegrid_texts.map(t => t.overlay)} />
        {/if}
        {#if element.text}
            <div>{@html element.text}</div>
        {/if}
    {/each}
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
    }
</style>