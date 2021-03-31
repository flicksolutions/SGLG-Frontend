import {locales} from 'svelte-i18n';
import { get as storeGet } from 'svelte/store';

export async function get(req, res, next) {
    /*res.setHeader('location', '/de/test')
    res.setHeader('Content-Type', 'text/html');
    res.end("<h1>Hello World</h1>");*/
    const browserLang = req.headers["accept-language"].substring(0,2)
    const lang = storeGet(locales).includes(browserLang) ? browserLang : 'de';
    res.writeHead(301, {'Location' : `/${lang}/`})
    res.end();
}