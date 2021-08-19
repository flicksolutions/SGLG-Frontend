<script context="module">
    import {waitLocale, locale} from 'svelte-i18n';
    import {directus, hydrateTranslations} from "../../functions";

    export async function preload({ params }) {
        const fields = ['title', 'content.page_content_id.title', 'content.page_content_id.slug', 'content.page_content_id.options', 'slug'];
        const deep = {
            content: {
                page_content_id: {
                    "_filter": {
                        'menu': {
                            "_eq": true
                        }
                    }
                }
            }
        };

        try {
            const res = (await directus.items('pages').readMany(hydrateTranslations(fields,deep,params.lang))).data;
            const pages = res.map(p => {
                if (p.translations?.length){
                    p.translations[0].subPages = p.translations[0]?.content?.map(c => c.page_content_id).filter(c => c);
                    return { ...p.translations[0], slug: p.slug };
                } else {
                    p.subPages = p.content.map(c => c.page_content_id).filter(c => c);
                    delete p.content;
                    return p;
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

<Header {segment} pages={pages.filter(p => p.slug !== 'impressum')}/> <!-- Filtering out the Impressum for the Header -->

<main>
    <slot></slot>
</main>

<Footer {segment} {pages}/>

<style lang="scss" global>
  @import "./style/global.scss";
  main {
    margin-top: $header-height;
  }
</style>