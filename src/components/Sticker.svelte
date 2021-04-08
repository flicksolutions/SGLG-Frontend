<script>
    import { directus } from "../functions";
    import marked from 'marked';
    let label = "";
    let link = "";

    directus.items('disturber').readMany({
        fields: ['label', 'link'],
        filter: {
            status: {
                _eq: 'published',
            },
        },
        limit: 1
    }).then(i => {
        label = marked(i.data[0].label);
        link = i.data[0].link;
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
      h3, p {
        font-size: 12px;
        margin: 0;
      }
      @media (min-width: $medium) {
        right: unset;
        left: 25%;
        padding: 20px;
        h3, p {
          font-size: 16px;
        }
      }
    }
</style>