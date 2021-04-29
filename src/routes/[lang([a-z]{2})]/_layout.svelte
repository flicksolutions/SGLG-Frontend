<script context="module">
    import {waitLocale} from 'svelte-i18n'
    import {directus} from "../../functions";

    export async function preload({ params }) {
        const fields = ['title', 'content.title'];
        const deep = {};
        const hydrateTranslations = (fields, deep, lang) => {
            if (lang !== 'de') { // if we are not in default locale, we need to get the translations of the items
                fields.push(...fields.map(f => `translations.${f}`));
                const trans = {"_filter": {
                        'languages_code': {
                            "_eq": lang
                        }
                    }
                }
                deep.translations = trans;
            }
            return { fields, deep }
        };
        try {
            const pages = (await directus.items('pages').readMany(hydrateTranslations(fields,deep,params.lang))).data.map(p => {
                if (p.translations?.length){
                    return p.translations[0].title;
                } else {
                    return p.title;
                }
            });
            // awaits for the loading of the default dictionaries
            await waitLocale()
            return { pages }
        } catch (err) {
            console.log("err")
            console.log(err)
            this.error(403, 'No Permission');
        }
    }
</script>

<script>
    import Header from '../../components/Header.svelte';
    import Footer from '../../components/Footer.svelte';
    import { onMount } from 'svelte';

    export let segment;
    export let pages;

    let FontTracker;

    onMount(async () => {
        //code for font-tracking
        window.MTFontIds = ['691880'];
        window.MTUserId ='002422c7-d577-4caf-966e-d57cdfef6b8b';
        const module = await import('../../../static/fonts/mtiFontTrackingCode.js');
        FontTracker = module.default;
    });

</script>

<Header {segment} {pages}/>

<main>
    <slot></slot>
</main>

<Footer {segment}/>

<style lang="scss" global>
  @import "./style/global.scss";
  main {
    margin-top: $header-height;
  }
</style>