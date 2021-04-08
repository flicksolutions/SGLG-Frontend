import { Directus } from '@directus/sdk';
import { locales } from 'svelte-i18n';
import { get } from 'svelte/store';
export const directus = new Directus('https://backend.ruralhistory.ch');

export async function getItems ({
                       locale = 'de',
                       fields= ['title','id','date'],
                       translatedFields,
                       collections
    }) {
    const readItem = {};
    let returnItems = [];
    if (locale === 'de') {
        readItem.fields = fields;//get only these fields
    } else {
        readItem.fields = [ ...translatedFields.map(f => `translations.${f}`) ,...fields.filter(f => !translatedFields.includes(f))]; //['translations.title', 'id','date']
        readItem['deep[translations][_filter][languages_code][_eq]'] = locale;
    }
    for (const directory of collections) {
        let responseItem = await directus.items(directory).readMany(readItem); //get each item in every relevant collection
        responseItem = responseItem.data;
        if (Array.isArray(responseItem)) {
            responseItem = responseItem.map(i => {
                i = {collection: directory, ...i?.translations?.[0], ...i};
                delete i.translations
                return i;
            })
            returnItems = [...returnItems, ...responseItem];
        } else {
            responseItem.collection = directory;
            responseItem = {collection: directory, ...responseItem?.translations?.[0], ...responseItem};
            delete responseItem.translations;
            returnItems = [...returnItems, responseItem];
        }
    }
    return returnItems
}

export async function getBg () {
    const { data } = await directus.files.readMany({
        fields: ['id'],
        filter: {
            folder: {
                name: {
                    _eq: 'bg'
                }
            }
        }
    })
    const randomIndex = Math.floor(Math.random() * data.length);
    const fileId = data[randomIndex].id;
    return `https://backend.ruralhistory.ch/assets/${fileId}`
}

export function setBg(node) {
    getBg().then(url => {
        node.style.backgroundImage = `url("${url}")`;
    })
}

export function checkLocale (lang) {
    if (get(locales).includes(lang)) {
        return { lang };
    } else {
        return { lang: 'de' }
    }
}