<script>
    import { locale, _, date } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import Sticker from '../../components/Sticker.svelte';
    import { getItems, setBg, getBg } from '../../functions';
    import { SVGS } from '../../constants';
    import InlineSVG from 'svelte-inline-svg'

    let items = [];
    let content = [];
    let bgContainer;
    let windowWidth;
    let featuredImg;

    let fields = ['content','items.item.*','items.collection'];
    $locale !== 'de' && fields.push('items.item.translations.*'); // if we are not in default locale, we need to get the translations of the items
    getItems({
        locale: $locale.slice(0, 2),
        fields: fields,
        translatedFields: ['content'],
        collections: ['homepage']
    }).then(i => {
        items = i[0].items.map(i => { //we set the items to display on the page. For that we consume the items from the response.
            return {                  //it may look funny to fiddle around with the items. but the reason is translation. I do this here because I want my html nice and understandable.
                ...i,
                item: {
                    ...i.item,
                    ...i.item.translations?.[0],  //but also replace any translatable fields with the translated ones.
                    id: i.item.id                 //exept for the id
                }
            }
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
            <li>
                <a href="{`/directory/detail/${item.collection}/${item.item.id}`}" class="{item.collection}">
                    <InlineSVG src={SVGS[item.collection]} class="svg"/> <h2>{item.item.title}</h2>
                </a>
                <div>
                    {#if item.item.date}
                    <p>{$date(new Date(item.item.date), { month: 'numeric', day: 'numeric', year: 'numeric' })}</p>
                    {/if}
                    <p>{item.collection}</p>
                </div>
            </li>
        {/each}
    </ol>
    <a class="button" href="/directory">Alle Einträge</a>
</section>
<section>
    {#each content as block}
        <h3>{block.title}</h3>
        <div>{@html block.content}</div>
    {/each}
</section>
<!-- other content -->

<style lang="scss">
  @import "../../style/theme.scss";

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
        div {
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

