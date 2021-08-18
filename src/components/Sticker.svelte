<script>
    import { directus } from "../functions";
    import marked from 'marked';
    import { locale } from 'svelte-i18n';
    import {hydrateTranslations} from "../functions";

    let label = "";
    let link = "";

    const fields = ['*'];
    const deep = {};

    directus.items('disturber').readMany({...hydrateTranslations(fields, deep, $locale), limit: 1}).then(i => {
        if ($locale !== 'de' && i?.data?.[0]?.translations?.[0]){
            label = marked(i.data[0].translations[0]?.label);
            link = i.data[0].translations[0]?.link;
        } else {
            label = marked(i.data[0].label);
            link = i.data[0].link;
        }

    })

</script>

<a href="{link}" class="sticker-wrapper">
    {@html label}
</a>

<style lang="scss">
    @import "../style/theme.scss";
    .sticker-wrapper {
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      position: absolute;
      right: $gutter;
      bottom: -3em;
      background: $sglg-orange;
      border-radius: 1000000000px;
      height: 150px;
      width: 150px;
      padding: 10px;
      transform: rotate(-15deg);
      color: $dark-green;
      text-decoration: none;
      :global(h3), :global(p) {
        font-size: 12px;
        margin: 0;
      }
      @media (min-width: $medium) {
        right: unset;
        left: 25%;
        padding: 20px;
        :global(h3), :global(p) {
          font-size: 16px;
        }
      }
    }
</style>