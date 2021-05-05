<script context="module">
    import { directus } from '../../../../functions';
    export async function preload({ params }) {
        try {
            let item = await directus.items('entities').readOne(params.id,
                {fields: ['*', 'itemtype.*', 'references.entities_related_id',
                        'referenced_by.entities_id.*', 'referenced_by.entities_id.itemtype.*',
                    'files.directus_files_id']}
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
    import {SVGS} from '../../../../constants';
    import InlineSVG from 'svelte-inline-svg';
    import ContentBoxes from '../../../../components/ContentBoxes.svelte';
    import {_, date} from 'svelte-i18n';
    import {onMount} from "svelte";
    import {getBg, setBg} from "../../../../functions";
    import ImageGrid from "../../../../components/ImageGrid.svelte";

    export let item;

    const cleanProps = dirtyItem => {
        const filterKeys = ['internal', 'referenced_by', 'references']
        return Object.keys(dirtyItem)
            .filter(key => dirtyItem.itemtype.frontend_fields.includes(key) && !filterKeys.includes(key))
            .reduce((obj, key) => {
                //convert val to date
                if (key.includes('date')) {
                    obj[key] = $date(new Date(dirtyItem[key]),
                        dirtyItem.itemtype.directory === 'publications' ?
                            {year: 'numeric'} :
                            {month: 'numeric', day: 'numeric', year: 'numeric'}
                    );
                } else {
                    obj[key] = dirtyItem[key];
                }

                return obj;
            }, {})
    }

    const frontEndProps = cleanProps(item);
    const references = item?.referenced_by.map(ref => cleanProps(ref.entities_id));
    let windowWidth, featuredImg;

    onMount(async () => {
        if (windowWidth > 800) {
            setBg(document.querySelector('body')); // set a new background image for the body
        } else {
            featuredImg = await getBg();
        }


    });
</script>
<svelte:window bind:innerWidth={windowWidth} />

{#if windowWidth > 800}
    <div class="spacer" style="height: 10vw;"></div>
{/if}

<section>
<h1 class:internal={item.internal}><InlineSVG src={SVGS[item.itemtype.directory]} class="svg"/>{item.title}</h1>
    <div class="props">
        <ContentBoxes content={frontEndProps}/>
        {#each item?.referenced_by as ref,i}
            <h3>{$_(ref.entities_id.itemtype.directory)}:</h3>
            <ContentBoxes content={references[i]}/>
        {/each}
    </div>
    {#if item.files}
        <ImageGrid images={item.files} />
    {/if}
    <button class="button" on:click={() => window.history.back()}>{$_('back')}</button>
</section>


<style lang="scss">
  @import "../../../../style/theme.scss";
    h1 {
      :global(svg){
        max-width: 1em;
        margin-right: 0.2em;
      }
      @media (min-width: $medium) {
        margin-left: calc(-1 * calc(1em + 0.2em));
      }
    }

    .props {
      @media (min-width: $medium) {
        grid-column: 1/-1;
      }
    }
    section {
      .button {
        margin: 2em 0 0 0;
        @media (min-width: $medium) {
          grid-column: 1;
          grid-row: 1;
          margin: 0;
          align-self: center;
        }
      }
      @media (min-width: $medium) {
        display: grid;
        grid-template-columns: 3fr 9fr;
      }
    }
</style>