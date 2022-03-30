import {locales} from 'svelte-i18n';
import { get as storeGet } from 'svelte/store';

export async function get(req, res, next) {
    const { slug } = req.params;
    const browserLang = req.headers["accept-language"] ? req.headers["accept-language"].substring(0,2) : 'de';
    const lang = storeGet(locales).includes(browserLang) ? browserLang : 'de';
    res.writeHead(301, {'Location' : `/${lang}/${slug}`})
    res.end();
}