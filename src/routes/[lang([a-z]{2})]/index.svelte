<script>
    import { locale, _, date } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import Sticker from '../../components/Sticker.svelte';
    import { setBg, getBg, directus, createLabel } from '../../functions';
    import { SVGS } from '../../constants';
    import InlineSVG from 'svelte-inline-svg';
    import { truncate } from 'htmlsave';

    let items = [];
    let content = [];
    let bgContainer;
    let windowWidth;
    let featuredImg;

    //get the content
    let fields = ['content', 'items.id', 'items.internal', 'items.references.entities_related_id.title','items.references.entities_related_id.id', 'items.references.entities_related_id.person', 'items.references.entities_related_id.internal', 'items.itemtype.directory', 'items.content', 'items.title', 'items.person', 'items.date', 'items.event_type', 'items.publication_type'];
    let deep = {items: {"_sort": "date"}};
    if ($locale !== 'de') { // if we are not in default locale, we need to get the translations of the items
        fields.push('translations.content', 'items.translations.title', 'items.translations.content');
        const trans = {"_filter": {
                'languages_code': {
                    "_eq": $locale
                }
            }
        }
        deep.items.translations = trans;
        deep.translations = trans;
    }

    directus.singleton('homepage').read({ fields, deep }).then(json => {
        items = json.items.map(i => {//we set the items to display on the page. For that we consume the items from the response.
            let cleanItem = {                  //it may look funny to fiddle around with the items. but the reason is translation. I do this here because I want my html nice and understandable.
                ...i,
                ...i.translations?.[0],  //but also replace any translatable fields with the translated ones.
            };
            if (i.references[0]?.entities_related_id?.title) {
                cleanItem.title = $_(`${i.itemtype.directory}_title`, {values: {title: i.references[0].entities_related_id.title}});
                cleanItem.internal = i.references[0].entities_related_id.internal;
            }
            return cleanItem
        });
        if ($locale !== 'de' && json.translations[0]?.content) {
            content = json.translations[0].content
        } else {
            content = json.content;
        }
    });

    onMount(async () => {
        if (windowWidth > 800) {
            setBg(document.querySelector('body')); // set a new background image for the body
        } else {
            featuredImg = await getBg();
        }
    });
</script>

<svelte:window bind:innerWidth={windowWidth} />

<svelte:head>
    <title>{$_('SGLG')}</title>
</svelte:head>

{#if featuredImg}
    <div style="position: relative"><Sticker /><img src="{featuredImg}" alt="featured" class="featured"></div>
{:else }
    <div class="spacer"><Sticker /></div>
{/if}

<section class="content-layout">
    <h2>
        {$_('news')}
        {#if windowWidth > 600}
            <br/><span class="internal">{$_('SGLG')}</span>
        {/if}
    </h2>
    <div class="list">
        <ol>
        {#each items as item}
            <li class:internal={item.internal}>
                <a href="{`${$locale}/directories/detail/${item?.references?.[0]?.entities_related_id?.id ?? item.id}`}" class="{item.itemtype.directory}">
                    {#if SVGS[item.itemtype.directory]}<InlineSVG src={SVGS[item.itemtype.directory]} class="svg"/>{/if}
                    <h2>{createLabel(item)}</h2>
                </a>
                <div class="meta">
                    {#if item.date}
                    <p>{$date(new Date(item.date),
                        item.itemtype.directory === 'publications' ? { year: 'numeric' } :
                            { month: 'numeric', day: 'numeric', year: 'numeric' })
                    }</p>
                    {/if}
                    <p>{$_(item.itemtype.directory, {values: {n:1}})}</p>
                </div>
                {#if item.content}
                    <div class="content">
                    {@html truncate(item.content, 250)}
                    </div>
                {/if}
            </li>
        {/each}
        </ol>
        <a class="button" href={`${$locale}/directories`} >{$_('all_entries')}</a>
    </div>
</section>
{#each content as block}
<section class:colorful={block.style} class="content-block">
    <div>
        <h3>{block.title}</h3>
        {@html block.content}
    </div>
</section>
{/each}
<!-- other content -->

<style lang="scss">
    @import "../../style/theme.scss";
    .featured {
    max-width: 100%;
    }
    ol {
      padding: 0;
      list-style: none;
      li {
        border-top: solid $line-grey thin;
        padding-top: 0.6em;
        margin-top: 1.5em;
        a:first-child {
          color: $dark-green;
          text-decoration: none;
          h2 {
            margin: 0 0 0.2em 0;
          }
        }
        .meta {
          display: grid;
          grid-auto-flow: column;
          justify-content: flex-start;
          p {
            color: $dark-green;
            margin: 0;
            &:not(:last-child){
              border-right: solid;
              border-right-width: thin;
              margin-right: 0.5em;
              padding-right: 0.5em;
            }

          }
        }
        .content{

        }
        &.internal {
          a:first-child, a :global(.svg) {
            color: $sglg-orange;
            fill: $sglg-orange;
          }
        }
      }
    }

    a :global(.svg) {
      margin-right: 0.6em;
      width: 22px;
      display: block;
      float: left;
      fill: $dark-green;
    }
</style>

