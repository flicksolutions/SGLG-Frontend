<script>
    import { locale, locales } from 'svelte-i18n';
    import { goto } from '@sapper/app';

    export let segment;

    $: route = segment ? segment : '';

    const setLocale = (target) => {
        $locale = target;
        goto(`${$locale}/${route}`);
    }
</script>

<ul class="langswitch">
    {#each $locales as lang}
        <li><a href="{`${lang}/${route}`}" on:click|preventDefault={() => setLocale(lang)}>{lang}</a></li>
    {/each}
</ul>