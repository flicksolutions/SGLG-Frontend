<script>
    import { locale, _ } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import Sticker from '../../components/Sticker.svelte';
    import { getItems, setBg } from '../../functions';

    let items = [];
    let content = [];
    let bgContainer;

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

    onMount(() => {
       setBg(document.querySelector('body')); // set a new background image for the body
    });
</script>


<svelte:head>
    <title>{$_('SGLG')}</title>
</svelte:head>

<Sticker />
<div class="spacer"></div>
<section>
    <h2>Aktuell {$locale}</h2>
    <ol>
        {#each items as item}
            <li>
                <a href="{`/directory/detail/${item.collection}/${item.item.id}`}" class="{item.collection}">{item.item.title}</a>
                <div><p>{item.item.date}</p><p>{item.collection}</p></div>
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
    .spacer {
      width: 100%;
      height: 51vw;
    }
  section {
    @include gutters;
    @include max-width;
    background-color: white;
  }
</style>

