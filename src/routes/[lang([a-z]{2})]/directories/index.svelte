<script context="module">
    /*import { directories } from '../../../constants';
    export async function preload() {
        return { directories };
    }*/
</script>
<script>
    import { setBg, getBg, directus } from '../../../functions';
    import { directories as directoryPromise } from '../../../constants';
    import { locale, _, date } from 'svelte-i18n';

    let directories = [];
    let directoryObjects;
    let table = [];
    let sortParam = "title";
    let columns = [];
    directoryPromise.then(i => {
        //TODO: do not fetch directories with super! :-)
        directoryObjects = i;
        directories = i.map(d => d.directory);
        selectors.categories = directories;
    })
    const selectors = {
        categories: [],
        onlySglg: false,
        dateFrom: "",
        dateTo: "",
        query: "",
    };

    let results;

    let getResults = async ({ categories = [], onlySglg = false, dateFrom = "", dateTo = "", query = "" }) => {
        /*let fields = ['id', 'itemtype', 'internal', 'title', 'date', 'event_type', 'event_hosted_by', 'event_end_date',
            'event_place', 'publications_publisher', 'publications_series', 'link', 'files',
            'publications_associated_instititutions', 'publications_person', 'content', 'publications_released_in',
            'publications_type', 'references', 'referenced_by'];*/
        let fields = [...new Set(categories.flatMap(c => directoryObjects.find(o => o.directory === c).frontend_fields)), 'itemtype.directory', 'id'];
        let deep = {};

        let filter = {
            'itemtype': {
                'directory': {
                    '_in': categories
                }
            }
        };
        if (onlySglg) {
            filter.internal = {
                '_eq': true
            }
        }
        if (dateFrom && dateTo) {
            filter.date = { '_between': [dateFrom, dateTo] }
        } else if (dateFrom) {
            filter.date = { '_gte': dateFrom }
        } else if (dateTo) {
            filter.date = { '_lte': dateTo }
        }

        if ($locale !== 'de') {
            //fields.push('translations.title', 'translations.event_hosted_by', 'translations.link', 'translations.content');
            fields.push('translations.*');
            deep.translations = {"_filter": {
                    'languages_code': {
                        "_eq": $locale
                    }
                }
            };
        }
        table = (await directus.items('entities').readMany({
            fields: fields,
            filter,
            deep,
            search: query
        })).data;

        //create columns
        const tempColumns = new Set();
        table.forEach(row => {
            for (let col in row) {
                tempColumns.add(col);
            }
        })
        columns = [...tempColumns];
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
        <table>
            <tr>
                {#each columns as col}
                    <th>{col}</th>
                {/each}
            </tr>
            {#each table as row (`${row.itemtype.directory}.${row.id}`)}
                <tr>
                    {#each columns as col}
                        <td>{row[col]}</td>
                    {/each}
                </tr>
            {/each}
            <tr></tr>
        </table>
    </section>
</div>