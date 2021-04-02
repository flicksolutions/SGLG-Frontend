<script context="module">
    /*export async function preload({ params }) {
        console.log(params.slug)
        const { slug } = params;
        return { slug }
    }*/
</script>

<script>
    /*import {onMount} from "svelte";
    import { goto } from '@sapper/app';
    import { locales, locale } from 'svelte-i18n';

    export let slug

    onMount(async () => {
        const browserLang = navigator.language.substring(0,2)
        const lang = $locales.includes(browserLang) ? browserLang : 'de';
        $locale = lang;
        goto(`/${lang}/${slug}`, {replaceState: true});
    });*/
</script>

redirecting...