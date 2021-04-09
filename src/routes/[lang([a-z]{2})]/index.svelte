<script>
    import { locale, _, date } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import Sticker from '../../components/Sticker.svelte';
    import { getItems, setBg, getBg } from '../../functions';
    import { SVGS } from '../../constants';
    import InlineSVG from 'svelte-inline-svg';
    import { truncate } from 'htmlsave';

    let items = [];
    let content = [];
    let bgContainer;
    let windowWidth;
    let featuredImg;

    let fields = ['content','items.item.*','items.collection', 'items.item.event.*', 'items.item.event_publication.item.*', 'items.item.event_publication.collection'];
    $locale !== 'de' && fields.push('items.item.translations.*'); // if we are not in default locale, we need to get the translations of the items
    getItems({
        locale: $locale.slice(0, 2),
        fields: fields,
        translatedFields: ['content'],
        collections: ['homepage']
    }).then(i => {
        items = i[0].items.map(i => {//we set the items to display on the page. For that we consume the items from the response.
            let cleanItem = {                  //it may look funny to fiddle around with the items. but the reason is translation. I do this here because I want my html nice and understandable.
                ...i,
                item: {
                    ...i.item,
                    ...i.item.translations?.[0],  //but also replace any translatable fields with the translated ones.
                    id: i.item.id                 //exept for the id
                }
            };
            switch (i.collection) {
                case "call_for_paper":
                    cleanItem.item.title = $_('cfp_title', { values: {title:i.item.event.title}});
                    cleanItem.link = `/directory/detail/event/${i.item.event.id}`;
                    cleanItem.item.internal = i.item.event.internal;
                    break;
                case "review":
                    cleanItem.item.title = $_('review_title', { values: {title: i.item.event_publication[0].item.title}});
                    cleanItem.link = `/directory/detail/${i.item.event_publication[0].collection}/${i.item.event_publication[0].item.id}`;
                    cleanItem.item.internal = i.item.event_publication[0].item.internal;
                    break;
                default:
                    cleanItem.link = `/directory/detail/${i.collection}/${i.item.id}`
            }

            return cleanItem
        });
        content = i[0].content;
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

<section>
    <h2>Aktuell</h2>

    <ol>
        {#each items as item}
            <li class:internal={item.item.internal}>
                <a href="{item.link}" class="{item.collection}">
                    {#if SVGS[item.collection]}<InlineSVG src={SVGS[item.collection]} class="svg"/>{/if}
                    <h2>{item.item.title}</h2>
                </a>
                <div class="meta">
                    {#if item.item.date}
                    <p>{$date(new Date(item.item.date), { month: 'numeric', day: 'numeric', year: 'numeric' })}</p>
                    {/if}
                    <p>{item.collection.replaceAll('_', ' ')}</p>
                </div>
                <div class="content">
                {#if item.item.content}{@html truncate(item.item.content, 250)}{/if}
                </div>
            </li>
        {/each}
    </ol>
    <a class="button" href="/directory" >Alle Einträge</a>
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
    .button, :global(.button) { //global selector is used to style the content of the homepage
      background-color: $dark-green;
      color: white;
      text-decoration: none;
      padding: 0.6em;
      margin: 0 auto;
      display: block;
      width: max-content;
    }

    .colorful {
      background-color: $sglg-orange;
      color: $dark-green;
      :global(div p) {
          font-family: $title-font;
      }
      :global(.button) {
        margin: 2em auto;
      }

    }

    .featured {
    max-width: 100%;
    }
    section {
    @include gutters;
    @include max-width;
    background-color: white;
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

