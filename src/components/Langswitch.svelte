<script>
    import { locale, locales } from 'svelte-i18n';
    import { goto } from '@sapper/app';
    import { waitLocale } from 'svelte-i18n'

    export let segment;

    $: route = segment ? segment : '';

    const setLocale = (target) => {
        $locale = target;
        goto(`${$locale}/${route}`).then(i => {
            if (target !== 'de') {
                waitLocale(target).then(i => location.reload())
            } else {
                location.reload()
            }
        }
        );
    }
</script>

<ul class="langswitch">
    {#each $locales as lang}
            <li><a href="{`${lang}/${route}`}" class:selected={lang === $locale} on:click|preventDefault={() => setLocale(lang)}>{lang.toUpperCase()}</a></li>
    {/each}
</ul>

<style lang="scss">
  .langswitch {
    list-style: none;
    padding: 0;
    display: flex;
    justify-content: center;
  }
  li {
    &:first-child {
      a {
        padding-left: 0;
      }
    }
    &:last-child {
      a {
        padding-right: 0;
      }
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
  }
</style>