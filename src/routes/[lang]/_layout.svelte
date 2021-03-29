<script context="module">
    import { waitLocale } from 'svelte-i18n'
    import { checkLocale } from '../../functions';

    export async function preload(page) {
        const { lang } = page.params;
        // awaits for the loading of the default dictionaries
        await waitLocale()
        return checkLocale(lang);
    }
</script>

<script>
    import Header from '../../components/Header.svelte';
    import Footer from '../../components/Footer.svelte';
    import { onMount } from 'svelte';
    import { locale } from "svelte-i18n";

    export let segment;
    export let lang;
    $locale !== lang && ($locale = lang);

    let FontTracker;

    onMount(async () => {
        //code for font-tracking
        window.MTFontIds = ['691880'];
        window.MTUserId ='002422c7-d577-4caf-966e-d57cdfef6b8b';
        const module = await import('../../../static/fonts/mtiFontTrackingCode.js');
        FontTracker = module.default;
    });

</script>

<Header {segment}/>

<main>
    <slot></slot>
</main>

<Footer {segment}/>

<style lang="scss" global>
  @import "./style/global.scss";
</style>