<a href="/" class="sticker-wrapper">
    <h3>Jetzt anmelden zur Generalversammlung</h3>
    <p>vom 22.06.2021<br>
    13:30 - 17:00</p>
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