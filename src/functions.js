import DirectusSDK from '@directus/sdk-js';
const directus = new DirectusSDK('https://backend.ruralhistory.ch');

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
        let responseItem = await directus.items(directory).read(readItem); //get each item in every relevant collection
        if (Array.isArray(responseItem)) {
            responseItem = responseItem.data.map(i => {
                i.collection = directory; //add the collection to the item
                return i;
            })
            returnItems = [...returnItems, ...responseItem];
        } else {
            responseItem.data.collection = directory;
            returnItems = [...returnItems, responseItem];
        }
    }
    return returnItems
}