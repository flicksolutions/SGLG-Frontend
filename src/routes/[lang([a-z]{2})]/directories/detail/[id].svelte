<script context="module">
    import { directus } from '../../../../functions';
    export async function preload({ params }) {
        try {
            let item = await directus.items('entities').readOne(params.id, {fields: ['*', 'itemtype.*', 'references.entities_related_id']});
            if (!item.title) {
                console.log('theres no title! returning the referenced object instead.')
                item = await directus.items('entities').readOne(item.references?.[0].entities_related_id, {fields: ['*', 'itemtype.*']});
            }
            return { item };
        } catch (err) {
            this.error(403, 'No Permission');
        }
    }
</script>
<script>
    import { SVGS } from '../../../../constants';
    import InlineSVG from 'svelte-inline-svg';
    import ContentBoxes from '../../../../components/ContentBoxes.svelte';

    export let item;
    const frontEndProps = Object.keys(item)
        .filter(key => item.itemtype.frontend_fields.includes(key))
        .reduce((obj, key) => {
        obj[key] = item[key];
        return obj
    },{});
    let windowWidth;
</script>
<svelte:window bind:innerWidth={windowWidth} />
{#if windowWidth > 800}
    <div class="spacer" style="height: 10vw;"></div>
{/if}

<section>
<h1 class:internal={item.internal}><InlineSVG src={SVGS[item.itemtype.directory]} class="svg"/> {item.title}</h1>
    <ContentBoxes content={frontEndProps}/>
    <button on:click={() => window.history.back()}>back</button>
</section>


<style lang="scss">
    h1 {
      :global(svg){
        max-width: 1em;
      }
    }
</style>