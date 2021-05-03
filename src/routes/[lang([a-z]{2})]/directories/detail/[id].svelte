<script context="module">
    import { directus } from '../../../../functions';
    export async function preload({ params }) {
        try {
            let item = await directus.items('entities').readOne(params.id,
                {fields: ['*', 'itemtype.*', 'references.entities_related_id', 'referenced_by.entities_id.*', 'referenced_by.entities_id.itemtype.*']}
            );
            if (!item.title) {
                console.log('theres no title! returning the referenced object instead.')
                item = await directus.items('entities').readOne(item.references?.[0].entities_related_id,
                    {fields: ['*', 'itemtype.*']}
                );
            }
            if (item.link[0]) {
                item.link = item.link.map(object => `<a href="${object.url}">${object.url}</a>`)
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
    import { _, date } from 'svelte-i18n';

    export let item;

    const cleanProps = dirtyItem => {
        const filterKeys = ['internal', 'referenced_by', 'references']
        return Object.keys(dirtyItem)
            .filter(key => dirtyItem.itemtype.frontend_fields.includes(key) && !filterKeys.includes(key))
            .reduce((obj, key) => {
                //convert val to date
                if (key.includes('date')){
                    obj[key] = $date(new Date(dirtyItem[key]),
                        dirtyItem.itemtype.directory === 'publications' ?
                            {year: 'numeric'} :
                            { month: 'numeric', day: 'numeric', year: 'numeric' }
                    );
                } else {
                    obj[key] = dirtyItem[key];
                }

                return obj;
            },{})
    }

    const frontEndProps = cleanProps(item);
    const references = item?.referenced_by.map(ref => cleanProps(ref.entities_id));
    let windowWidth;
</script>
<svelte:window bind:innerWidth={windowWidth} />
{#if windowWidth > 800}
    <div class="spacer" style="height: 10vw;"></div>
{/if}

<section>
<h1 class:internal={item.internal}><InlineSVG src={SVGS[item.itemtype.directory]} class="svg"/> {item.title}</h1>
    <ContentBoxes content={frontEndProps}/>
    {#each item?.referenced_by as ref,i}
        <h3>{$_(ref.entities_id.itemtype.directory)}:</h3>
        <ContentBoxes content={references[i]}/>
    {/each}
    <button class="button" on:click={() => window.history.back()}>back</button>
</section>


<style lang="scss">
    h1 {
      :global(svg){
        max-width: 1em;
      }
    }
</style>