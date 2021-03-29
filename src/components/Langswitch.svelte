<script>
    import { locales } from 'svelte-i18n';
</script>

<ul class="langswitch">
    {#each $locales as locale}
        <li><a href="{`/${locale}/`}">{locale}</a></li>
    {/each}
</ul>