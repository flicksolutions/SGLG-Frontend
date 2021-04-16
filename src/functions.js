import { Directus } from '@directus/sdk';
import { locales } from 'svelte-i18n';
import { get } from 'svelte/store';
export const directus = new Directus('https://backend.ruralhistory.ch');
let sortParam = "title";


const mergeSorted = (a, b) => {
    console.log(`mergesort beeing called with a:${a} and b: ${b}`)
    console.log(a)
    console.log(b)
    const answer = new Array(a.length + b.length)
    let i = 0, j = 0, k = 0;
    while (i < a.length && j < b.length) {
        if (a[i][sortParam] < b[j][sortParam]) {
            answer[k] = a[i];
            i++;
        }else {
            answer[k] = b[j];
            j++;
        }
        k++;
    }
    while (i < a.length) {
        answer[k] = a[i];
        i++;
        k++;
    }
    while (j < b.length) {
        answer[k] = b[j];
        j++;
        k++;
    }
    return answer;
}

export async function getItems ({
                       locale = 'de',
                       fields= [],
                       filter = null,
                       translatedFields = [],
                       collections,
                       sortP = "title"
    }) {

    let returnItems = [];
    sortParam = sortP;

    for (const directory of collections) {
        let sortField = "";
        if (directory.frontend_fields.includes(sortP)) {
            sortField = sortP;
        } else {
            // We cannot sort of nested columns...
            /*for (let superD of directory.super) {
                if (directory.frontend_fields.includes(`${superD}.${sortP}`)) {
                    sortField = `${superD}.${sortP}`;
                }
            }*/
        }
        let responseItem = await directus.items(directory.directory).readMany(
            createReadObject(directory, locale, fields.length ? fields : directory.frontend_fields, filter, translatedFields, sortField)
        ); //get each item in every relevant collection
        responseItem = responseItem.data;
        if (Array.isArray(responseItem)) {
            responseItem = responseItem.map(i => replaceTranslatedFields(i, directory.directory))
            returnItems = [...returnItems, responseItem];
        } else {
            responseItem = replaceTranslatedFields(responseItem, directory.directory);
            returnItems = [...returnItems, [responseItem]];
        }
    }
    console.log("array of sorted arrays:")
    console.log(returnItems)

    return returnItems;
}
function createNestedFilter (parts, val) {
    if (parts.length === 1) {
        return {[parts[0]]: val}
    } else {
        return {[parts.shift()]: createNestedFilter(parts,val)}
    }
}

const createReadObject = (collection, locale, fields, filter, translatedFields, sortP) => {
    const readItem = {fields: [], filter: {}, sort: sortP};

    console.log("fields is:")
    console.log(fields)

    //settings dependend on super
    if (collection.super) { //set filter depending on super
        if (filter) {
            let tempFilter = [];
            for (let col of collection.super) {
                let filterParts = col.split('.');
                tempFilter.push(createNestedFilter(filterParts, filter));
            }
            readItem.filter = {["_or"]: tempFilter};
        }

        /*for (let [key, value] of Object.entries(filter)) {
            readItem[`deep[${collection.super_field}][_filter][${key}][${Object.keys(value)[0]}]`] = Object.values(value)[0]
        }*/
        //readItem.sort = collection.super.map(s => `${s}.${sortP}`)
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