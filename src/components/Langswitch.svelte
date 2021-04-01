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
            <li><a href="{`${lang}/${route}`}" class:selected={lang === $locale} on:click={() => setLocale(lang)}>{lang.toUpperCase()}</a></li>
    {/each}
</ul>

<style lang="scss">
  .langswitch {
    list-style: none;
    padding: 0;
    display: flex;
    justify-content: center;
  }
  a {
    color: inherit;
    text-decoration: none;
    padding: 0 0.8em;
    text-underline-offset: 4px;
    font-size: 1em;
    &.selected {
      text-decoration: underline;
    }
  }
</style>