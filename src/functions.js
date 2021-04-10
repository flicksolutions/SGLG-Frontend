import { Directus } from '@directus/sdk';
import { locales } from 'svelte-i18n';
import { get } from 'svelte/store';
export const directus = new Directus('https://backend.ruralhistory.ch');

export async function getItems ({
                       locale = 'de',
                       fields= ['*'],
                       filter = null,
                       translatedFields = [],
                       collections
    }) {

    let returnItems = [];

    for (const directory of collections) {
        let responseItem = await directus.items(directory.directory).readMany(createReadObject(directory, locale, fields, filter, translatedFields)); //get each item in every relevant collection
        responseItem = responseItem.data;
        if (Array.isArray(responseItem)) {
            responseItem = responseItem.map(i => replaceTranslatedFields(i, directory.directory))
            returnItems = [...returnItems, ...responseItem];
        } else {
            responseItem = replaceTranslatedFields(responseItem, directory.directory);
            returnItems = [...returnItems, responseItem];
        }
    }
    return returnItems
}
function createFilter (parts, val) {
    if (parts.length === 1) {
        return {[parts[0]]: val}
    } else {
        return {[parts.shift()]: createFilter(parts,val)}
    }
}

const createReadObject = (collection, locale, fields, filter, translatedFields) => {
    const readItem = {fields: []};

    //settings dependend on super
    if (collection.super_field) { //set filter depending on super
        if (filter) {
            const filterParts = collection.super_field.split('.');
            console.log('these are the parts:')
            console.log(filterParts)
            readItem.filter = createFilter(filterParts, filter);
        }
        /*for (let [key, value] of Object.entries(filter)) {
            readItem[`deep[${collection.super_field}][_filter][${key}][${Object.keys(value)[0]}]`] = Object.values(value)[0]
        }*/
        readItem.fields = fields.map(f => `${collection.super_field}.${f}`)
    } else {
        if (filter) {
            readItem.filter = filter;
        }
    }

    if (locale === 'de') {
        readItem.fields = [...readItem.fields, ...fields];//get only these fields
    } else {
        if (fields[0] === '*' && fields.length === 1) {
            readItem.fields = [...readItem.fields,...fields, 'translations.*']
        } else {
            readItem.fields = [...readItem.fields, ...translatedFields.map(f => `translations.${f}`) ,...fields.filter(f => !translatedFields.includes(f))]; //['translations.title', 'id','date']
        }
        readItem['deep[translations][_filter][languages_code][_eq]'] = locale;
    }
    console.log(readItem)
    return readItem;
}

const replaceTranslatedFields = (object, collection) => {
    const returnItem = {
        collection: collection,
        ...object,
        ...object?.translations?.[0],
        id: object.id
    };
    delete returnItem.translations;
    return returnItem
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