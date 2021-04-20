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
        sort: '',
        page: 1
    };

    let results;

    let getResults = async ({ categories = [], onlySglg = false, dateFrom = "", dateTo = "", query = "", page = 1, sort = "" }) => {
        /*let fields = ['id', 'itemtype', 'internal', 'title', 'date', 'event_type', 'event_hosted_by', 'event_end_date',
            'event_place', 'publications_publisher', 'publications_series', 'link', 'files',
            'publications_associated_instititutions', 'publications_person', 'content', 'publications_released_in',
            'publications_type', 'references', 'referenced_by'];*/
        let returnColumns, returnTable;
        let fields = [...new Set(categories.flatMap(c => directoryObjects.find(o => o.directory === c).frontend_fields)), 'itemtype.directory', 'id', 'references.entities_related_id.title'];
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
        returnTable = (await directus.items('entities').readMany({
            fields: fields,
            filter,
            deep,
            search: query,
            page,
            sort,
            //limit: 2
        })).data;

        //create columns
        returnColumns = Object.keys(returnTable[0]);
        let emptyCols = {};
        returnTable.forEach(row => {
            if (row.publications_person){
                row.publications_person = row.publications_person.map(person => `${person.name} (${person.role})`).join(', ')
            }
            row.itemtype = row.itemtype.directory;
            for (let col in row) {
                //if ((typeof row[col] === 'string' && !row[col]) || (Array.isArray(row[col]) && !row[col].length)) {
                if (!row[col]) {
                    if (!emptyCols[col]) {
                        emptyCols[col] = 1;
                    } else {
                        emptyCols[col] += 1;
                    }
                }
            }
        });
        //remove empty cols from the array (and link since we don't want to show that)
        for (const [key, value] of Object.entries(emptyCols)) {
            if (value >= returnTable.length) {
                returnColumns = returnColumns.filter(r => r !== key && r !== 'link');
            }
        }
        return { returnColumns , returnTable }
    }

    const loadMore = async () => {
        selectors.page += 1;
        table = [...table, ...(await getResults(selectors)).returnTable];
    }
    const setResults = async () => {
       const { returnTable, returnColumns } = await getResults(selectors);
       table = returnTable;
       columns = returnColumns;
    }
    const sortResults = (val) => {
        if (selectors.sort === val) {
            selectors.sort = `-${val}`;
        } else {
            selectors.sort = val;
        }
        setResults();
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
        <button on:click={setResults}>{$_('search')}</button>
    </section>
    <section class="table">
        <table>
            <tr>
                {#each columns as col}
                    <th on:click={() => sortResults(col)}>{col}</th>
                {/each}
            </tr>
            {#each table as row (row.id)}
                <tr>
                    {#each columns as col}
                        <td>{#if col === 'title'}
                            <a href={`${$locale}/directories/detail/${row.id}`}>{row[col] ?? $_(`${row.itemtype}_title`, {values: {title: row.references?.[0].entities_related_id.title}})}</a>
                            {:else if (typeof row[col] === 'string' && row[col]) || (Array.isArray(row[col]) && row[col].length) }
                                {#if typeof row[col] !== "string"}
                                    {row[col].length}
                                {:else}
                                    {@html row[col]}
                                {/if}
                        {/if}</td>
                    {/each}
                </tr>
            {/each}
            <tr></tr>
        </table>
        {#if table.length}
            <button on:click={loadMore}>{$_('load more...')}</button>
        {/if}
    </section>
</div>