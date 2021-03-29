<script context="module">
    /*import { checkLocale } from '../../functions';
    export async function preload(page, session) {
        const { lang } = page.params;
        return checkLocale(lang);
    }*/
</script>

<script>
    import { locale } from 'svelte-i18n';
    import { _ } from 'svelte-i18n';
    import Sticker from '../../components/Sticker.svelte';
    import { getItems } from '../../functions';

    export let lang;

    //$locale !== lang && ($locale = lang);
    let items = [];
    let content = [];


    $: {
        $locale = $locale;
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
    }
</script>


<svelte:head>
    <title>{$_('Schweizerische Gesellschaft für ländliche Geschichte')}</title>
</svelte:head>

<div><!-- this element needs the background-img -->
    <Sticker />
    <section>
        <h2>Aktuell {$locale} {lang}</h2>
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
</div>

<style lang="scss">

</style>

