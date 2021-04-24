<script context="module">
    import {directus} from "../../../functions";
    export async function preload() {
        const directoryObjects = (await directus.items('directories').readMany()).data;
        return { directoryObjects };
    }
</script>
<script>
    import { setBg, getBg } from '../../../functions';
    import { locale, _, date } from 'svelte-i18n';
    import {onMount} from "svelte";
    import Checkbox from "../../../components/Checkbox.svelte"
    import CheckboxGroup from "../../../components/CheckboxGroup.svelte"

    export let directoryObjects;
    let directories = directoryObjects.map(d => d.directory)
    let table = [];
    let columns = [];
    const selectors = {
        categories: directories,
        onlySglg: false,
        dateFrom: "",
        dateTo: "",
        query: "",
        sort: '',
        page: 1
    };

    let results;

    let getResults = async ({ categories = [], onlySglg = false, dateFrom = "", dateTo = "", query = "", page = 1, sort = "" }) => {
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
        returnColumns = returnTable[0] ? Object.keys(returnTable[0]) : [];
        let emptyCols = {};
        returnTable.forEach(row => {
            if (row.publications_person){
                row.publications_person = row.publications_person.map(person => `${person.name} (${person.role})`).join(', ')
            }
            row.itemtype = row.itemtype.directory;
            for (let col in row) {
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

    const hideElement = (e) => e.target.style.display = "none";

    const dateLabels = [];

    $:checkboxes = directories.map(d => {return {value: d, label: d}}); //TODO: translated labels?

    onMount(() => setResults());
</script>

<section>
    <h1>Verzeichnisse</h1>
    <form class="filters" on:submit|preventDefault={setResults}>
        <div class="category-selectors">
            <Checkbox checked={selectors.categories.length === directories.length} customEvent={true}
                      on:click={() =>
                       {selectors.categories.length === directories.length ? selectors.categories = [] : selectors.categories = directories}}>{$_('all')}</Checkbox>
            <CheckboxGroup { checkboxes } bind:group={selectors.categories} />
        </div>
        <Checkbox bind:checked={selectors.onlySglg}>{$_('onlySglg')}</Checkbox>
        <fieldset class="date-selectors">
            <legend>{$_('Dates')}</legend>
            <label for="date" on:click={hideElement} bind:this={dateLabels[0]}>{$_('from')}</label>
            <input id="date" type="date" bind:value={selectors.dateFrom} on:focus={() => dateLabels[0].style.display = "none"}>
            <label for="end-date" on:click={hideElement} bind:this={dateLabels[1]}>{$_('to')}</label>
            <input id="end-date" type="date" bind:value={selectors.dateTo} on:focus={() => dateLabels[1].style.display = "none"}>
        </fieldset>
        <label class="search">{$_('query')}<input type="search" bind:value={selectors.query}></label>
        <input type="submit" value={$_('search')} class="button" />
    </form>
</section>
<section class="table">
    {#if columns.length}
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
        {#if table.length} <!-- TODO: find metadata if there are more items to show -->
            <button on:click={loadMore} class="button">{$_('load more...')}</button>
        {/if}
    {:else}
        <p>{$_('no entries')}</p>
    {/if}
</section>

<style lang="scss">
  @import "../../../style/theme.scss";
  .category-selectors {
    display: grid;
    grid-template-columns: 1fr;
  }
  .date-selectors {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border: 0;
    padding: 0;
    label {
      background-color: white;
      grid-row: 1;
      z-index: 2;
      border: 1px solid $line-grey;
      padding-left: 0.6em;
    }
    input {
      grid-row: 1;
    }
    label:first-of-type, input:first-of-type {
      grid-column: 1;
    }
    label:last-of-type, input:last-of-type {
      grid-column: 2;
    }
  }
  .search {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
  .filters {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 2em;
    font-family: $title-font;
  }



</style>