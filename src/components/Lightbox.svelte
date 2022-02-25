<script>
     import { createEventDispatcher } from 'svelte';

    export let img;
    export let alt;

     const dispatch = createEventDispatcher();

    const exit = () => dispatch('exitLightbox')
</script>

<div on:click={() => exit()}>
     <img src={img} alt="{alt}">
</div>

<style lang="scss">
div {
     display: block;
     position: fixed;
     top: 0;
     left: 0;
     height: 100vh;
     width: 100vw;
     background-color: darkgrey;
     z-index: 99;
     img {
          max-width: 100%;
          max-height: 100%;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
     }
}
</style>