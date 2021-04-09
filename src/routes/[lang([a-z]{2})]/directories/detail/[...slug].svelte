<script context="module">
    export async function preload({ params }) {
        let [collection, id] = params.slug;

        return { collection, id };
    }
</script>
<script>
    export let collection;
    export let id;
</script>

collection: {collection}
id: {id}