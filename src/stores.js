import { writable } from 'svelte/store';

export const selectors = writable({
    categories: [],
    onlySglg: false,
    news: false,
    dateFrom: "",
    dateTo: "",
    query: "",
    sort: '-date',
    page: 1,
    limit: 20
});