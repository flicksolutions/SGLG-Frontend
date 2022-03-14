<script context="module">
    import {directus, hydrateTranslations, replaceTranslations} from "../../../functions";

    export async function preload({ params }) {
        const directoryObjects = (await directus.items('directories').readByQuery()).data;

        const { string: currentNl, description: nlDescription} = replaceTranslations(await directus.singleton('current_newsletter').read({
            ...hydrateTranslations(["string", "description"],{},params.lang)
        }),params.lang)
        //console.log((await directus.singleton('current_newsletter').read({ fields, deep })))
        //const currentNl = page.query.news === '' ? (await directus.singleton('current_newsletter').read()).data.string : false;
        return { directoryObjects, currentNl, nlDescription };
    }
</script>
<script>
    import { setBg, getBg, createLabel } from '../../../functions';
    import { locale, _, date } from 'svelte-i18n';
    import {onMount} from "svelte";
    import Checkbox from "../../../components/Checkbox.svelte";
    import CheckboxGroup from "../../../components/CheckboxGroup.svelte";
    import { SVGS } from '../../../constants';
    import InlineSVG from 'svelte-inline-svg';
    import { stores } from "@sapper/app";
    import { marked } from 'marked';
    import { selectors } from "../../../stores.js"

    export let directoryObjects;
    export let currentNl;
    export let nlDescription = "";

    const { page:pageStore } = stores();

    let directories = directoryObjects.map(d => d.directory)
    let table = [];
    let columns = [];
    let scrollW, lowerScroll, upperScroll;
    let meta = {};
    let windowWidth, featuredImg;
    let pageLimit = "20";
    $:$selectors.limit = parseInt(pageLimit);
    const setCats = queryparams => {
        if (Array.isArray(queryparams)){
            $selectors.categories = queryparams
        } else if (typeof queryparams === 'string' && queryparams) {
            $selectors.categories = [queryparams]
        } else if (!$selectors.categories.length) {
            $selectors.categories = directoryObjects.map(d => d.directory)
        }
    }
    const setNews = i => {
        $selectors.news = i;
        if (i) {
            $selectors.categories = directoryObjects.map(d => d.directory);
        }
    }
    $:{
        setCats($pageStore.query['cat[]']);
        setNews($pageStore.query['news'] === '');
    }
    $:if ($selectors && $selectors.categories.length) {setResults()}

    let results;
    async function getResults ({ categories: cats = directoryObjects.map(d => d.directory), onlySglg = false, news = false, dateFrom = "", dateTo = "", query = "", page = 1, sort = "-date", limit }) {
        let returnColumns, returnTable;
        let categoryFields = cats.flatMap(c => directoryObjects.find(o => o.directory === c)?.frontend_fields);
        let fields = ['id', 'itemtype.directory', 'references.entities_related_id.title', 'references.entities_related_id.id'];
        if (categoryFields[0]) {
            fields = [...fields, ...new Set(categoryFields)]
        }
        let deep = {};

        let filter = {
            'itemtype': {
                'directory': {
                    '_in': cats
                }
            }
        };
        if (onlySglg) {
            filter.internal = {
                '_eq': true
            }
        }
        if (news) {
            filter.published_in = {
                '_eq': currentNl
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
        const answer = await directus.items('entities').readByQuery({
            fields: fields,
            filter,
            deep,
            search: query,
            page,
            sort,
            meta: "*",
            limit
        })
        returnTable = answer.data;
        meta = answer.meta;

        //create columns
        returnColumns = returnTable[0] ? Object.keys(returnTable[0]) : [];
        let emptyCols = {};
        returnTable.forEach(row => {
            /*if (row.person){ //person is now just a string
                row.person = row.person.map(person => `${person.name} (${person.role})`).join(', ')
            }*/
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
                const filterKeys = ['link', 'id', 'internal']
                returnColumns = returnColumns.filter(r => r !== key && !filterKeys.includes(r));
            }
        }
        if (!returnColumns?.title) returnColumns.splice(2, 0, 'title');
        //sort returnColumns
        const optimal = ['date', 'itemtype', 'title', 'person', 'event_place']
        returnColumns = [...optimal.filter(v => returnColumns.includes(v)), ...returnColumns.filter(v => !optimal.includes(v))];
        return { returnColumns , returnTable }
    }

    const loadMore = async (val) => {
        $selectors.page += val;
        table = [...table, ...(await getResults($selectors)).returnTable];
    }

    const setResults = async () => {
       const { returnTable, returnColumns } = await getResults($selectors);
       table = returnTable;
       columns = ["date", "itemtype", "title", "event_place"];
    }
    const sortResults = (val) => {
        if ($selectors.sort === val) {
            $selectors.sort = `-${val}`;
        } else {
            $selectors.sort = val;
        }
        setResults();
    }

    const hideElement = (e) => e.target.style.display = "none";

    const dateLabels = [];

    $:checkboxes = directories.map(d => {return {value: d, label: d}}).sort((a,b) => {
        let labelA = $_(a.label);
        let labelB = $_(b.label);
        if (labelA < labelB) {
            return -1;
        }
        if (labelA > labelB) {
            return 1;
        }
        return 0;
    });

    onMount(async () => {
        if (windowWidth > 800) {
            setBg(document.querySelector('body')); // set a new background image for the body
        } else {
            featuredImg = await getBg();
        }
        //await setResults();
    });

    const arrow = value => {
        let filter;
        let style = "";
        if ($selectors.sort[0] === "-") {
            filter = $selectors.sort.substring(1);
            style = "style='transform: rotate(180deg)'";
        } else {
            filter = $selectors.sort;
        }
        if (value === filter || (value === 'title' && filter === 'person')) { //the OR-clause is there because when we sort for the title, we actually sort for the Person...
            return `<svg ${style} xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" ><line x1=\"12\" y1=\"5\" x2=\"12\" y2=\"19\"></line><polyline points=\"19 12 12 19 5 12\"></polyline></svg>`;
        }
        return ""
    }
    const sortable = col => {
        for (const row of table) {
            if (row[col] == null) {
            } else {
                return typeof row[col] === "string"
            }
        }
        return false
    }

    const changePage = (targetPage) => {
        if (targetPage <= maxPage && targetPage >= 1) {
            $selectors.page = targetPage;
            setResults();
        } else {
            console.log("cannot change page!")
        }
    }
    $:maxPage = Math.ceil(meta.filter_count / $selectors.limit);
</script>

<svelte:window bind:innerWidth={windowWidth} />

<svelte:head>
    <title>{$selectors.news ? $_('newsletter') : $_('directories', {values: {n:directories.length}})}</title>
</svelte:head>

{#if windowWidth > 800}
    <div class="spacer" style="height: 10vw;"></div>
{/if}
<section class="filter-section">
    {#if ($selectors.news)}
        <h1>{$_('newsletter')} {currentNl}</h1>
    {:else}
        <h1>{$_('directories', {values: {n:4}})}</h1>
    {/if}
    <form class="filters" on:submit|preventDefault={setResults}>
        {#if (!$selectors.news)}
            <div class="category-selectors">
                <Checkbox checked={$selectors.categories.length === directories.length} customEvent={true}
                          on:click={() =>
                           {$selectors.categories.length === directories.length ? $selectors.categories = [] : $selectors.categories = directories}}>
                    <span class="icon-placeholder"></span>{$_('all')}</Checkbox>
                <CheckboxGroup { checkboxes } bind:group={$selectors.categories} />
            </div>
        {/if}
        <Checkbox bind:checked={$selectors.onlySglg} cssClass="internal">{$_('onlySglg')}</Checkbox>
        {#if ($selectors.news)}
            {@html marked(nlDescription)}
        {/if}
        <!--<Checkbox bind:checked={selectors.news}>{$_('news')}</Checkbox>-->
        {#if (!$selectors.news)}
            <fieldset class="date-selectors">
                <legend>{$_('Dates')}</legend>
                <label for="date" on:click={hideElement} bind:this={dateLabels[0]}>{$_('from')}</label>
                <input id="date" type="date" bind:value={$selectors.dateFrom} on:focus={() => dateLabels[0].style.display = "none"}>
                <label for="end-date" on:click={hideElement} bind:this={dateLabels[1]}>{$_('to')}</label>
                <input id="end-date" type="date" bind:value={$selectors.dateTo} on:focus={() => dateLabels[1].style.display = "none"}>
            </fieldset>
            <label class="search">{$_('query')}<input type="search" bind:value={$selectors.query} style="display: block; width: 100%">
            </label>
        {/if}
    </form>
</section>
<section class="table">
    {#if columns.length}
        <div id="upper-scroll" bind:this={upperScroll} on:scroll={() => lowerScroll.scrollLeft = upperScroll.scrollLeft}>
            <div style="height: 10px; width: {scrollW}px;"></div></div>
        <div class="overflow-container" bind:this={lowerScroll} on:scroll={() => upperScroll.scrollLeft = lowerScroll.scrollLeft}>
            <table bind:clientWidth={scrollW}>
                <colgroup>
                    <col span="1" style="width: 1%; white-space: nowrap;">
                    <col span="1" style="width: 22px;">
                    <col span="1" style="">
                    <col span="1" style="width: 1%; white-space: nowrap;">
                </colgroup>
                <tr>
                    {#each columns as col}
                        {#if (sortable(col))}
                            <th on:click={() => sortResults(col === 'title' ? 'person' : col)}
                                class:selected={col === $selectors.sort.substring($selectors.sort.indexOf('-')+1)}
                                class="sortable"
                            ><!-- instead of the title field, we sort for person, specific request...-->
                                {col === 'itemtype' ? "" : col === 'title' ? $_('person, title') : $_(col)}&nbsp;{@html arrow(col)}</th>
                        {:else}
                            <th>{$_(col)}</th>
                        {/if}
                    {/each}
                </tr>
                {#each table as row (row.id)}
                    <tr>
                        {#each columns as col (col)}
                            <td>{#if col === 'title' || SVGS[row[col]]}
                                <a href={`${$locale}/directories/detail/${row?.references?.[0]?.entities_related_id?.id ?? row.id}`} class:internal={row.internal} title="{row[col]}" aria-label="{row[col]}">
                                    {#if col !== 'title'}
                                        <InlineSVG src={SVGS[row[col]]} class="svg"/>
                                    {:else}
                                        {createLabel(row)}
                                    {/if}
                                </a>
                                {:else if col.includes('date') && row[col]}
                                {$date(new Date(row[col]), row.itemtype === 'publications' ? {year: 'numeric'} : { month: 'numeric', day: 'numeric', year: 'numeric' })}
                                {:else if (!Array.isArray(row[col]) && row[col]) || (Array.isArray(row[col]) && row[col].length) }
                                    {#if Array.isArray(row[col])}
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
        </div>
        <p style="float: left;margin-right: 1em;"><button class="button arrow" disabled="{!($selectors.page > 1)}" on:click={() => changePage($selectors.page-1)}>{@html '<'}</button>
            <span style="margin: 0 1em">{$selectors.limit * ($selectors.page - 1) + 1} - {($selectors.limit * ($selectors.page - 1)  + $selectors.limit) < meta.filter_count ? (selectors.limit * (selectors.page - 1)  + selectors.limit) : meta.filter_count } {$_('of')} {meta.filter_count}</span>
        <button class="button arrow" disabled='{!($selectors.page < maxPage)}' on:click={() => {changePage($selectors.page+1)}}>{@html '>'}</button></p>
        <p style="line-height: 32px;">{$_('per_page')}: <select name="limit" bind:value={pageLimit}>
                                <option>20</option>
                                <option>50</option>
                                <option>100</option>
                                <option>1000</option>
        </select></p>
    {:else}
        <p>{$_('no entries')}</p>
    {/if}
</section>

<style lang="scss">
  @import "../../../style/theme.scss";
    .filter-section{
      background-color: $bg-grey;
    }
  .button.arrow {
    margin: 0;
    display: inline;
  }

  select {
    background-color: white;
    border: 1px solid $line-grey;
  }
  .overflow-container, #upper-scroll {
    overflow-x: auto;
    /*margin-left: -1em;
    margin-right: -1em;*/
  }

  .category-selectors {
    display: grid;
    grid-template-columns: 1fr;
    @media (min-width: $medium) {
      grid-row: 1/3;
    }
  }
  input[type=submit]{
    @media (min-width: 1000px) {
      grid-column-end: -1;
      grid-row: 3;
      justify-self: end;
    }
  }
  input[type=date] {
    font-family: $title-font;
    font-weight: normal;
    strong {
      font-weight: normal;
    }
  }
  .date-selectors {
    @media (min-width: 1000px) {
      grid-row: 2;
    }
    display: grid;
    grid-template-columns: 1fr 1fr;
    border: 0;
    padding: 0;
    align-self: start;
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
    align-self: start;
    @media (min-width: 1000px) {
      grid-row: 2;
    }
  }
  .filters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px,1fr));
    grid-auto-flow: row dense;
    grid-gap: 2em;
    font-family: $title-font;
    font-weight: normal;
    strong {
      font-weight: normal;
    }
    color: $dark-green;
    @media (min-width: $medium) {
      :global(.internal) {
        grid-column: 1;
      }
    }
    @media (min-width: 1000px) {
      :global(.internal) {
        grid-column: initial;
      }
    }
  }
  .icon-placeholder {
    margin: 0 calc(0.6em - 5px) 0 0.6em;
    width: 22px;
    height: 1rem;
    display: block;
    float: left;
  }

  table {
    //width: max-content;
    //border-spacing: 1em;
    //margin-left: -1em;
    border-collapse: collapse;
    min-width: 100%;
    th {
      color: $line-grey;
      text-align: left;
        &.selected{
          color: $dark-green;
          white-space: nowrap;
        }
      &.sortable:hover {
        cursor: pointer;
        color: $dark-green;
      }
      :global(svg) {
        max-height: 20px;
        max-width: 20px;
      }
    }
    th,td {
      padding-top: 0.2em;
      padding-bottom: 0.2em;
      border-bottom: solid 1px $line-grey;
    }
    th:not(:first-of-type),td:not(:first-of-type) {
      padding-left: 1em;
      //padding: 1em 0 0 1em;
    }
    td {
      max-width: 250px;
      vertical-align: top;
      a {
        text-decoration: none;
        font-family: $title-font;
        font-weight: normal;
        strong {
          font-weight: normal;
        }
        &:not(.internal) {
          color: $dark-green;
          fill: $dark-green;
        }
        :global(svg){
          width: 22px;
        }
      }
    }
  }

</style>