<script context="module">
    import { directus } from '../../functions';
    export async function preload({ params }) {
        const content = await directus.items('pages').readMany({filter: {slug: {"_eq": params.slug}}});
        if (content?.data?.[0]) {
            return { content: content.data[0] }
        }
        this.error(404, 'Page not found');
    }
</script>

<script>
    export let content;
</script>

{JSON.stringify(content)}