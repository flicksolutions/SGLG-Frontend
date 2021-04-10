<script>
    import { getItems, setBg, getBg, directus } from '../../../functions';
    import { locale, _, date } from 'svelte-i18n';

    let directories = [];
    let directoryObjects;
    directus.items('directories').readMany().then(i => {
        directoryObjects = i.data;
        directories = i.data.map(d => d.directory);
        selectors.categories = directories;
    });
    const selectors = {
        categories: [],
        onlySglg: false,
        dateFrom: "",
        dateTo: "",
        query: "",
    };

    let results;

    let getResults = async ({ categories = [], onlySglg = false, dateFrom = "", dateTo = "", query = ""  }) => {
        results = await getItems({
            locale: $locale,
            filter: onlySglg ? {internal: {_eq: true}}: null,
            collections: categories.map(d => directoryObjects.find(o => o.directory === d)),
            //fields: ["translations"]
        });
        console.log(results)
    }

</script>
<h1>Verzeichnisse</h1>
<div class="directory-nav">
    <div class="category-selectors">
        <label>
            <input type="checkbox" id="all"
                   checked={selectors.categories.length === directories.length}
                   on:click={() => {selectors.categories.length === directories.length ? selectors.categories = [] : selectors.categories = directories}}>
            {$_('all')}</label>
        {#each directories as category}
            <label><input type="checkbox" bind:group={selectors.categories} value={category}>{category}</label>
        {/each}
    </div>
    <section class="filters">
        <label><input type="checkbox" bind:checked={selectors.onlySglg}>{$_('onlySglg')}</label>
        <label><input type="date" bind:value={selectors.dateFrom}>{$_('from')}</label>
        <label><input type="date" bind:value={selectors.dateTo}>{$_('to')}</label>
        <label><input type="search" bind:value={selectors.query}>{$_('query')}</label>
        <button on:click={() => getResults(selectors)}>{$_('search')}</button>
    </section>
    <section class="table">

    </section>
</div>