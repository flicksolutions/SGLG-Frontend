<script context="module">
    import { directus, hydrateTranslations, replaceTranslations } from '../../../../functions';
    export async function preload({ params }) {
        try {
            let fields = ['*', 'itemtype.*', 'references.entities_related_id',
                'referenced_by.entities_id.*', 'referenced_by.entities_id.itemtype.*',
                'files.directus_files_id']
            let item = replaceTranslations(await directus.items('entities').readOne(params.id, hydrateTranslations(fields, {}, params.lang)),params.lang);

            if (item.references?.[0]?.entities_related_id) {
                console.log('theres no title! returning the referenced object instead.')
                item = await directus.items('entities').readOne(item.references?.[0].entities_related_id,
                    {fields: ['*', 'itemtype.*']}
                );
            }
            return { item };
        } catch (err) {
            console.log(err)
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
    import {addAccordionListener, getBg, setBg, createLabel} from "../../../../functions";
    import ImageGrid from "../../../../components/ImageGrid.svelte";

    export let item;

    const setLinks = (arr) => {
        if (Array.isArray(arr)) {
            return arr.map(object => {
                let url = object.url.includes('http') ? object.url : `http://${object.url}`;
                return `<a href="${url}" target="_blank">${url}</a>`}
            )
        }
    };

    const cleanProps = dirtyItem => {
        const filterKeys = ['internal', 'referenced_by', 'references']
        let clean = Object.keys(dirtyItem)
            .filter(key => dirtyItem.itemtype.frontend_fields.includes(key) && !filterKeys.includes(key))
            .reduce((obj, key) => {
                //convert val to date
                if (key.includes('date') && dirtyItem[key]) {
                    obj[key] = $date(new Date(dirtyItem[key]),
                        dirtyItem.itemtype.directory === 'publications' ?
                            {year: 'numeric'} :
                            {month: 'numeric', day: 'numeric', year: 'numeric'}
                    );
                } else if (key.includes('link')) {
                    obj[key] = setLinks(dirtyItem[key]);
                } else {
                    obj[key] = dirtyItem[key];
                }

                return obj;
            }, {});
        if (dirtyItem.itemtype.directory === "publications") {
            clean = {title: clean.title, person: clean.person, ...clean}
        }
        return clean
    }

    const frontEndProps = cleanProps(item);
    const references = item?.referenced_by.filter(ref => ref.entities_id).map(ref => {
        return {
            title: ref.entities_id.itemtype.directory,
            content: cleanProps(ref.entities_id)
        }
    });

    let windowWidth, featuredImg;

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

<svelte:head>
    <title>{item.title}</title>
</svelte:head>

{#if windowWidth > 800}
    <div class="spacer" style="height: 10vw;"></div>
{/if}

<section class="content-layout">
<h1 class:internal={item.internal} ><InlineSVG src={SVGS[item.itemtype.directory]} class="svg"/><!--{createLabel(item)}--></h1>
    <div class="props">
        <ContentBoxes content={frontEndProps}/>
        {#each references as ref}
            <h3>{$_(ref.title, {values: {n:1}})}:</h3>
            <ContentBoxes content={ref.content}/>
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
    @media (min-width: $medium) {
      //margin-left: calc(-1 * calc(1em + 0.2em));
    }
  }
  .button {
    @media (min-width: $medium) {
      grid-column: 1;
      grid-row: 1;
    }
  }
  /*@import "../../../../style/theme.scss";
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
    }*/
</style>