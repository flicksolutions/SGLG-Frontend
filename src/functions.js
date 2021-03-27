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
        returnItems = [...returnItems, ...(await directus.items(directory).read(readItem)).data.map(i => { //get each item in every relevant collection
            i.collection = directory //add the collection to the item
            if (!i.title) {
                //i.title = i.translations[0]?.title;
            }
            return i
        })];
    }
    return returnItems
}