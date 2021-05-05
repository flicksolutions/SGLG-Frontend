<script context="module">
    import { directus } from '../../functions';
    export async function preload({ params }) {
        const content = await directus.items('pages').readMany({filter: {slug: {"_eq": params.slug}}});
        if (content?.data?.[0]) {
            return { meta: content.data[0] }
        }
        this.error(404, 'Page not found');
    }
</script>

<script>
    import ContentBoxes from '../../components/ContentBoxes.svelte';
    import ImageGrid from "../../components/ImageGrid.svelte";

    export let meta;

    let content = [];

    $:directus.items('pages').readOne(meta.id, {fields: ["content.page_content_id.*", "content.page_content_id.imagegrid_img.directus_files_id"]}).then(a => content = a.content.map(c => c.page_content_id));
</script>

<section>
    <h1>{meta.title}</h1>
    <p>{meta.description}</p>
    {#each content as element}
        <h2 id="{element.slug}">{element.title}</h2>
        {#if element.text}
            <div>{@html element.text}</div>
        {/if}
        {#if element.imagegrid_img.length}
            <ImageGrid images={element.imagegrid_img} captions={element?.imagegrid_texts.map(t => t.caption)} overlay={element?.imagegrid_texts.map(t => t.overlay)} />
        {/if}
    {/each}
</section>