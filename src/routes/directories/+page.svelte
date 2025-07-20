<script>
	import { preventDefault } from 'svelte/legacy';
	import { createLabel } from '$lib/functions';
	import { getLocale } from '$lib/paraglide/runtime';
	import { onMount } from 'svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import CheckboxGroup from '$lib/components/CheckboxGroup.svelte';
	import { SVGS } from '$lib/constants';
	import { marked } from 'marked';
	import { page as pageStore } from '$app/state';
	import { m } from '$lib/paraglide/messages.js';
	import { linkHandler } from '$lib/functions';
	import MiniSearch from 'minisearch';

	let { data } = $props();
	let { directories, currentNl, nlDescription = '', nlTitle = '' } = data;
	let minisearch = $state(
		new MiniSearch({
			fields: ['title', 'person', 'event_place', 'publications_series', 'isbn', 'content'],
			storeFields: 'id'
		})
	);
	const getItems = async (params) => {
		return data.allItems;
	};
	const getCount = (params) => {
		return data.allItems.length;
	};

	let selectors = $state({
		categories: [],
		onlySglg: false,
		news: false,
		dateFrom: '',
		dateTo: '',
		query: '',
		sort: '-date',
		page: 1,
		limit: 20
	});
	/** @type {import('./$types').Snapshot<string>} */
	export const snapshot = {
		capture: () => ({ selectors, minisearch }),
		restore: (value) => {
			selectors = value.selectors;
			minisearch = value.minisearch;
		}
	};

	let table = $state([]);
	let columns = $state([]);
	let scrollW = $state(),
		lowerScroll = $state(),
		upperScroll = $state();
	let meta = $state(0);
	let pageLimit = $state('20');
	const setCats = (queryparams) => {
		if (Array.isArray(queryparams)) {
			selectors.categories = queryparams;
		} else if (typeof queryparams === 'string' && queryparams) {
			selectors.categories = [queryparams];
		} else if (!selectors.categories.length) {
			selectors.categories = directories;
		}
	};
	const setNews = (i) => {
		selectors.news = i;
		if (i) {
			selectors.categories = directories;
		}
	};

	let results;
	async function getResults({
		categories: cats = directories,
		onlySglg = false,
		news = false,
		dateFrom = '',
		dateTo = '',
		query = '',
		page = 1,
		sort = '-date',
		limit
	}) {
		let returnColumns, returnTable;
		let categoryFields = cats.flatMap((c) => directories.find((o) => o === c)?.frontend_fields);
		let fields = [
			'id',
			'itemtype.directory',
			'references.entities_related_id.title',
			'references.entities_related_id.id'
		];
		if (categoryFields[0]) {
			fields = [...fields, ...new Set(categoryFields)];
		}
		let deep = {};

		let filter = {
			itemtype: {
				directory: {
					_in: cats
				}
			}
		};
		if (onlySglg) {
			filter.internal = {
				_eq: true
			};
		}
		if (news) {
			filter.published_in = {
				_eq: currentNl
			};
		}
		if (dateFrom && dateTo) {
			filter.date = { _between: [dateFrom, dateTo] };
		} else if (dateFrom) {
			filter.date = { _gte: dateFrom };
		} else if (dateTo) {
			filter.date = { _lte: dateTo };
		}

		if (getLocale() !== 'de') {
			fields.push('translations.*');
			deep.translations = {
				_filter: {
					languages_code: {
						_eq: getLocale()
					}
				}
			};
		}
		const answer = await getItems({
			fields: fields,
			filter,
			search: query,
			page,
			sort,
			limit
		});
		returnTable = answer;
		meta = getCount({
			filter,
			search: query
		});

		//create columns
		returnColumns = returnTable[0] ? Object.keys(returnTable[0]) : [];
		let emptyCols = {};
		returnTable.forEach((row) => {
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
				const filterKeys = ['link', 'id', 'internal'];
				returnColumns = returnColumns.filter((r) => r !== key && !filterKeys.includes(r));
			}
		}
		if (!returnColumns?.title) returnColumns.splice(2, 0, 'title');
		//sort returnColumns
		const optimal = ['date', 'itemtype', 'title', 'person', 'event_place'];
		returnColumns = [
			...optimal.filter((v) => returnColumns.includes(v)),
			...returnColumns.filter((v) => !optimal.includes(v))
		];
		return { returnColumns, returnTable };
	}

	const loadMore = async (val) => {
		selectors.page += val;
		table = [...table, ...(await getResults(selectors)).returnTable];
	};

	const setResults = async () => {
		const { returnTable, returnColumns } = await getResults(selectors);
		table = returnTable;
		columns = ['date', 'itemtype', 'title', 'event_place'];
	};
	const sortResults = (val) => {
		if (selectors.sort === val) {
			selectors.sort = `-${val}`;
		} else {
			selectors.sort = val;
		}
		setResults();
	};

	const hideElement = (e) => (e.target.style.display = 'none');

	const dateLabels = $state([]);

	let allDocumentsAdded = $state(Promise.resolve());

	onMount(async () => {
		if (minisearch?.documentCount <= 1) {
			allDocumentsAdded = new Promise((resolve) => {
				minisearch.addAllAsync(data.allItems).then(() => {
					console.log(minisearch.documentCount, 'documents added to minisearch');
					resolve();
				});
			});
		}
		if (!selectors.categories.length) {
			console.log('no categories set, setting default');
			selectors.categories = directories;
			setResults();
		}
	});

	const arrow = (value) => {
		let filter;
		let style = '';
		if (selectors.sort[0] === '-') {
			filter = selectors.sort.substring(1);
			style = "style='transform: rotate(180deg)'";
		} else {
			filter = selectors.sort;
		}
		if (value === filter || (value === 'title' && filter === 'person')) {
			//the OR-clause is there because when we sort for the title, we actually sort for the Person...
			return `<svg ${style} xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" ><line x1=\"12\" y1=\"5\" x2=\"12\" y2=\"19\"></line><polyline points=\"19 12 12 19 5 12\"></polyline></svg>`;
		}
		return '';
	};
	const sortable = (col) => {
		for (const row of table) {
			if (row[col] == null) {
			} else {
				return typeof row[col] === 'string';
			}
		}
		return false;
	};

	const changePage = (targetPage) => {
		if (targetPage <= maxPage && targetPage >= 1) {
			selectors.page = targetPage;
			console.log('changePage');
			setResults();
		} else {
			console.log('cannot change page!');
		}
	};
	$effect(() => {
		selectors.limit = parseInt(pageLimit);
	});
	$effect(() => {
		if (pageStore.url.searchParams.getAll('cat[]').length) {
			setCats(pageStore.url.searchParams.getAll('cat[]'));
		}
		setNews(pageStore.url.searchParams.get('news') === '');
	});
	$effect(() => {
		if (selectors && selectors.categories.length) {
			setResults();
		}
	});
	let checkboxes = $derived(
		directories
			.map((d) => d.directory)
			.sort((a, b) => {
				let labelA = m[a]({ count: 1 });
				let labelB = m[b]({ count: 1 });
				if (labelA < labelB) {
					return -1;
				}
				if (labelA > labelB) {
					return 1;
				}
				return 0;
			})
	);
	let maxPage = $derived(Math.ceil(meta / selectors.limit));
</script>

<svelte:head>
	<title>{selectors.news ? m.newsletter() : m.directories({ count: 1 })}</title>
</svelte:head>
<div class="spacer" style={selectors.news ? '' : 'height: 10vw'}></div>
<section class="filter-section">
	{#if selectors.news}
		<h1>{nlTitle}</h1>
	{:else}
		<h1>{m.directories({ count: 1 })}</h1>
	{/if}
	<form class="filters" onsubmit={preventDefault(setResults)}>
		{#if !selectors.news}
			<div class="category-selectors">
				<Checkbox
					checked={selectors.categories.length === directories.length}
					customEvent={true}
					on:click={() => {
						selectors.categories.length === directories.length
							? (selectors.categories = [])
							: (selectors.categories = directories);
					}}
				>
					<span class="icon-placeholder"></span>{m.all()}</Checkbox
				>
				<CheckboxGroup {checkboxes} bind:group={selectors.categories} />
			</div>
		{/if}
		<Checkbox bind:checked={selectors.onlySglg} cssClass="internal">{m.onlySglg()}</Checkbox>
		{#if selectors.news}
			{@html marked(nlDescription)}
		{/if}
		{#if !selectors.news}
			<fieldset class="date-selectors">
				<legend>{m.Dates()}</legend>
				<label for="date" onclick={hideElement} bind:this={dateLabels[0]}>{m.from()}</label>
				<input
					id="date"
					type="date"
					bind:value={selectors.dateFrom}
					onfocus={() => (dateLabels[0].style.display = 'none')}
				/>
				<label for="end-date" onclick={hideElement} bind:this={dateLabels[1]}>{m.to()}</label>
				<input
					id="end-date"
					type="date"
					bind:value={selectors.dateTo}
					onfocus={() => (dateLabels[1].style.display = 'none')}
				/>
			</fieldset>
			<label class="search"
				>{m.query()}<input
					type="search"
					bind:value={selectors.query}
					style="display: block; width: 100%"
				/>
			</label>
		{/if}
	</form>
</section>
<section class="table">
	{#if columns.length}
		<div
			id="upper-scroll"
			bind:this={upperScroll}
			onscroll={() => (lowerScroll.scrollLeft = upperScroll.scrollLeft)}
		>
			<div style="height: 10px; width: {scrollW}px;"></div>
		</div>
		<div
			class="overflow-container"
			bind:this={lowerScroll}
			onscroll={() => (upperScroll.scrollLeft = lowerScroll.scrollLeft)}
		>
			<table bind:clientWidth={scrollW}>
				<colgroup>
					<col span="1" style="width: 1%; white-space: nowrap;" />
					<col span="1" style="width: 22px;" />
					<col span="1" style="" />
					<col span="1" style="width: 1%; white-space: nowrap;" />
				</colgroup>
				<tbody>
					<tr>
						{#each columns as col}
							{#if sortable(col)}
								<th
									onclick={() => sortResults(col === 'title' ? 'person' : col)}
									class:selected={col === selectors.sort.substring(selectors.sort.indexOf('-') + 1)}
									class="sortable"
									><!-- instead of the title field, we sort for person, specific request...-->
									{col === 'itemtype'
										? ''
										: col === 'title'
											? m['person, title']()
											: m[col]()}&nbsp;{@html arrow(col)}</th
								>
							{:else}
								<th>{m[col]()}</th>
							{/if}
						{/each}
					</tr>
					{#each table as row (row.id)}
						<tr>
							{#each columns as col (col)}
								<td
									>{#if col === 'title' || SVGS[row[col]]}
										<a
											href={linkHandler(
												`/directories/detail/${row?.references?.[0]?.entities_related_id?.id ?? row.id}`
											)}
											class:internal={row.internal}
											title={row[col]}
											aria-label={row[col]}
										>
											{#if col !== 'title'}
												{@html SVGS[row[col]]}
											{:else}
												{createLabel(row)}
											{/if}
										</a>
									{:else if col.includes('date') && row[col]}
										{row.itemtype === 'publications'
											? new Date(row[col]).getFullYear()
											: new Date(row[col]).toLocaleDateString(getLocale(), {
													year: 'numeric',
													month: 'numeric',
													day: 'numeric'
												})}
									{:else if (!Array.isArray(row[col]) && row[col]) || (Array.isArray(row[col]) && row[col].length)}
										{#if Array.isArray(row[col])}
											{row[col].length}
										{:else}
											{@html row[col]}
										{/if}
									{/if}</td
								>
							{/each}
						</tr>
					{/each}
					<tr></tr>
				</tbody>
			</table>
		</div>
		<p style="float: left;margin-right: 1em;">
			<button
				class="button arrow"
				disabled={!(selectors.page > 1)}
				onclick={() => changePage(selectors.page - 1)}>{@html '<'}</button
			>
			<span style="margin: 0 1em">
				{selectors.limit * (selectors.page - 1) + 1} - {selectors.limit * (selectors.page - 1) +
					selectors.limit <
				meta
					? selectors.limit * (selectors.page - 1) + selectors.limit
					: meta}
				{m.of()}
				{meta}
			</span>
			<button
				class="button arrow"
				disabled={!(selectors.page < maxPage)}
				onclick={() => {
					changePage(selectors.page + 1);
				}}>{@html '>'}</button
			>
		</p>
		<p style="line-height: 32px;">
			{m['per_page']()}:
			<select name="limit" bind:value={pageLimit}>
				<option>20</option>
				<option>50</option>
				<option>100</option>
				<option>1000</option>
			</select>
		</p>
	{:else}
		<p>{m['no entries']()}</p>
	{/if}
</section>

<style lang="scss">
	.filter-section {
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
	.overflow-container,
	#upper-scroll {
		overflow-x: auto;
	}

	.category-selectors {
		display: grid;
		grid-template-columns: 1fr;
		@media (min-width: $medium) {
			grid-row: 1/3;
		}
	}
	:global([type='submit']) {
		@media (min-width: 1000px) {
			grid-column-end: -1;
			grid-row: 3;
			justify-self: end;
		}
	}
	:global(input[type='date']) {
		font-family: $title-font;
		font-weight: normal;
		:global(strong) {
			font-weight: normal;
		}
	}
	.date-selectors {
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
		label:first-of-type,
		input:first-of-type {
			grid-column: 1;
		}
		label:last-of-type,
		input:last-of-type {
			grid-column: 2;
		}
		@media (min-width: 1000px) {
			grid-row: 2;
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
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		grid-auto-flow: row dense;
		grid-gap: 2em;
		font-family: $title-font;
		font-weight: normal;
		:global(strong) {
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
		border-collapse: collapse;
		min-width: 100%;
		th {
			color: $line-grey;
			text-align: left;
			&.selected {
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
		th,
		td {
			padding-top: 0.2em;
			padding-bottom: 0.2em;
			border-bottom: solid 1px $line-grey;
		}
		th:not(:first-of-type),
		td:not(:first-of-type) {
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
				:global(strong) {
					font-weight: normal;
				}
				&:not(.internal) {
					color: $dark-green;
					fill: $dark-green;
				}
				:global(svg) {
					width: 22px;
				}
			}
		}
	}
</style>
