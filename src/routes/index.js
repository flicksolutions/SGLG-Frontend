import {locales} from 'svelte-i18n';
import { get as storeGet } from 'svelte/store';

export async function get(req, res, next) {
    const browserLang = req.headers["accept-language"].substring(0,2)
    const lang = storeGet(locales).includes(browserLang) ? browserLang : 'de';
    res.writeHead(301, {'Location' : `/${lang}/`})
    res.end();
}