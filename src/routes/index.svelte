<script>
import {onMount} from "svelte";
import { goto } from '@sapper/app';
import { locales, locale } from 'svelte-i18n';

onMount(async () => {
    const browserLang = navigator.language.substring(0,2)
    const lang = $locales.includes(browserLang) ? browserLang : 'de';
    $locale = lang;
    goto(`/${lang}/`, {replaceState: true});
});
</script>

redirecting...