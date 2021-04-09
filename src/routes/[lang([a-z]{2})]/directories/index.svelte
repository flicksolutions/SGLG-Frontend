<script>
    import { getItems, setBg, getBg, directus } from '../../../functions';
    import { locale, _, date } from 'svelte-i18n';

    let directories = [];
    const selectors = {
        categories: [],
        onlySglg: false,
        dateFrom: "",
        dateTo: "",
        query: "",
    };
    directus.singleton('directories').read({fields: ['directories']}).then(i => {
        directories = i.directories;
        selectors.categories = i.directories;
    });

</script>
<h1>Verzeichnisse</h1>
<div class="directory-nav">
    <div class="category-selectors">
        <label>
            <input type="checkbox" id="all"
                   checked={selectors.categories === directories.length}
                   on:click={() => {selectors.categories.length === directories.length ? selectors.categories = [] : selectors.categories = directories}}>
            {$_('all')}</label>
        {#each directories as category}
            <label><input type="checkbox" bind:group={selectors.categories} value={category}>{category}</label>
        {/each}
    </div>
    <div class="filters">
        <label><input type="checkbox" bind:checked={selectors.onlySglg}>{$_('onlySglg')}</label>
        <label><input type="date" bind:value={selectors.dateFrom}>{$_('from')}</label>
        <label><input type="date" bind:value={selectors.dateTo}>{$_('to')}</label>
        <label><input type="search" bind:value={selectors.query}>{$_('query')}</label>
        <button>{$_('search')}</button>
    </div>
</div>