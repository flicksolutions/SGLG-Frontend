<script>
    import { locale, locales } from 'svelte-i18n';

    const setLocale = (target) => {
        $locale = target;
    }
</script>

<ul class="langswitch">
    {#each $locales as locale}
        <li><a href="{`/${locale}`}" on:click|preventDefault={() => setLocale(locale)}>{locale}</a></li>
    {/each}
</ul>