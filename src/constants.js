import {directus} from "./functions";

export const SVGS = {
    "event": '/svg/Icon-Veranstaltungen.svg',
    "publications": '/svg/Icon-Publikationen.svg',
    "call_for_paper": '/svg/Icon-Call-for-papers.svg',
    "review": '/svg/Icon-Rezensionen-Berichte.svg'
}

async function createDirectory() {
    return (await directus.items('directories').readMany()).data;
}

export const directories = createDirectory();