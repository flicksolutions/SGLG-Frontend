<script>
    import { locale, locales } from 'svelte-i18n';
    import { goto } from '@sapper/app';

    export let segment;

    $: route = segment ? segment : '';

    const setLocale = (target) => {
        $locale = target;
        goto(`${$locale}/${route}`).then(i => location.reload());
    }
</script>

<ul class="langswitch">
    {#each $locales as lang}
        {#if lang !== $locale}
            <li><a href="{`${lang}/${route}`}" on:click={() => setLocale(lang)}>{lang}</a></li>
        {/if}
    {/each}
</ul>