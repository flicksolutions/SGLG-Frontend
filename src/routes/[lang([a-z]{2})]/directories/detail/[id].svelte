<script context="module">
    import { directus } from '../../../../functions';
    export async function preload({ params }) {
        try {
            const item = await directus.items('entities').readOne(params.id);
            return { item };
        } catch (err) {
            this.error(403, 'No Permission');
        }
    }
</script>
<script>
    import { directories } from '../../../../constants';
    export let item;
    export let err = false;
</script>

<button>back</button>
{JSON.stringify(item)}