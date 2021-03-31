<script context="module">
    import { checkLocale } from '../../functions';
    export async function preload(page, session) {
        const { lang } = page.params;
        return checkLocale(lang);
    }
</script>

<script>
    import {locale} from "svelte-i18n";

    export let lang

    $locale !== lang && ($locale = lang);
</script>

<h1>Imprint: {$locale}</h1>