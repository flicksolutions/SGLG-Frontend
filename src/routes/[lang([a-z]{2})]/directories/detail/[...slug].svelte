<script context="module">
    import { directus } from '../../../../functions';
    export async function preload({ params }) {
        let [collection, id] = params.slug;
        const item = await directus.items(collection).readOne(id);
        if (item.status === 'published') {
            return {item};
        }
        this.error(403, 'No Permission');
    }
</script>
<script>
    import { directories } from '../../../../constants';
    export let item;
</script>

<button>back</button>
{item.title}
<div>
    {#await directories then val}
        {#each val.data.find(d => d.directoy === item.directory).frontend_fields as field}
            {field}: {item[field]}
        {/each}
    {/await}
</div>