import { createDirectus, readItems, rest, readFiles } from '@directus/sdk';
import { locales, localizeHref } from '$lib/paraglide/runtime';
import { get } from 'svelte/store';
import { m } from '$lib/paraglide/messages';
import { base } from '$app/paths';
export const directus = createDirectus(
	'https://misty-frank-flicksolutions-b4bb2a19.koyeb.app'
).with(rest());

export async function getItems({
	locale = 'de',
	fields = [],
	filter = null,
	translatedFields = [],
	collections,
	sortP = 'title'
}) {
	let returnItems = [];

	for (const directory of collections) {
		let sortField = '';
		if (directory.frontend_fields.includes(sortP)) {
			sortField = sortP;
		}
		let responseItem = await directus.query(
			readItems(
				directory.directory,
				createReadObject(
					directory,
					locale,
					fields.length ? fields : directory.frontend_fields,
					filter,
					translatedFields,
					sortField
				)
			)
		);
		responseItem = responseItem.data;
		if (Array.isArray(responseItem)) {
			responseItem = responseItem.map((i) => replaceTranslatedFields(i, directory.directory));
			returnItems = [...returnItems, responseItem];
		} else {
			responseItem = replaceTranslatedFields(responseItem, directory.directory);
			returnItems = [...returnItems, [responseItem]];
		}
	}
	return returnItems;
}
function createNestedFilter(parts, val) {
	if (parts.length === 1) {
		return { [parts[0]]: val };
	} else {
		return { [parts.shift()]: createNestedFilter(parts, val) };
	}
}

const createReadObject = (collection, locale, fields, filter, translatedFields, sortP) => {
	const readItem = { fields: [], filter: {}, sort: sortP };

	console.log('fields is:');
	console.log(fields);

	//settings dependend on super
	if (collection.super) {
		//set filter depending on super
		if (filter) {
			let tempFilter = [];
			for (let col of collection.super) {
				let filterParts = col.split('.');
				tempFilter.push(createNestedFilter(filterParts, filter));
			}
			readItem.filter = { ['_or']: tempFilter };
		}
	} else {
		if (filter) {
			readItem.filter = filter;
		}
	}

	if (locale === 'de') {
		readItem.fields = [...readItem.fields, ...fields]; //get only these fields
	} else {
		if (fields[0] === '*' && fields.length === 1) {
			readItem.fields = [...readItem.fields, ...fields, 'translations.*'];
		} else {
			readItem.fields = [
				...readItem.fields,
				...translatedFields.map((f) => `translations.${f}`),
				...fields.filter((f) => !translatedFields.includes(f))
			]; //['translations.title', 'id','date']
		}
		readItem['deep[translations][_filter][languages_code][_eq]'] = locale;
	}
	return readItem;
};

const replaceTranslatedFields = (object, collection) => {
	const returnItem = {
		collection: collection,
		...object,
		...object?.translations?.[0],
		id: object.id
	};
	delete returnItem.translations;
	return returnItem;
};

export async function getBg() {
	const data = await directus.request(
		readFiles({
			fields: ['id'],
			filter: {
				folder: {
					name: {
						_eq: 'bg'
					}
				}
			}
		})
	);
	const randomIndex = Math.floor(Math.random() * data.length);
	const fileId = data[randomIndex].id;
	return `https://misty-frank-flicksolutions-b4bb2a19.koyeb.app/assets/${fileId}`;
}

export function setBg(node) {
	getBg().then((url) => {
		node.style.backgroundImage = `url("${url}")`;
	});
}

export function checkLocale(lang) {
	if (get(locales).includes(lang)) {
		return { lang };
	} else {
		return { lang: 'de' };
	}
}

export function addAccordionListener(node) {
	node.forEach((e) => e.addEventListener('click', () => e.classList.toggle('active')));
}

export const hydrateTranslations = (fields, deep, lang) => {
	if (lang !== 'de') {
		// if we are not in default locale, we need to get the translations of the items - slug and string don't exist in translations
		fields.push(
			...fields.filter((f) => f !== 'slug' && f !== 'string').map((f) => `translations.${f}`)
		);
		const trans = {
			_filter: {
				languages_code: {
					_eq: lang
				}
			}
		};
		deep.translations = trans;
	}
	return { fields, deep };
};

export function replaceTranslations(res, lang) {
	let returnObject;
	if (res.data) {
		returnObject = res.data;
	} else {
		returnObject = res;
	}
	if (lang !== 'de') {
		const replace = (o) => {
			if (typeof o.translations?.[0] === 'object') {
				Object.keys(o.translations?.[0]).forEach((key) => {
					if (!o.translations?.[0][key]) {
						delete o.translations?.[0][key];
					}
				});
			}
			const ret = { ...o, ...o.translations?.[0] };
			if (o.id) {
				ret.id = o.id;
			}
			delete ret.translations;
			return ret;
		};

		if (Array.isArray(returnObject)) {
			returnObject = returnObject.map(replace);
		} else {
			returnObject = replace(returnObject);
		}
	}
	return returnObject;
}

export function createLabel(item) {
	let itemtype = typeof item.itemtype === 'string' ? item.itemtype : item.itemtype.directory;
	let review,
		eventType,
		person,
		review_person,
		title = '';
	switch (itemtype) {
		case 'review':
			review = `${m.recension()} ${m.of()}:`;
			title = item.references?.[0]?.entities_related_id?.title || item.title;
			person = `${item.references?.[0]?.entities_related_id?.person || item.person}:`;
			review_person = item.person ? ` (${item.person})` : '';
			return `${review} ${person} ${title}${review_person}`;
		case 'event':
			eventType = item.event_type && m[item.event_type] ? `${m[item.event_type]()}:` : '';
			title = item.title;
			return `${eventType} ${title}`;
		case 'call_for_paper': {
			title = item.references?.[0]?.entities_related_id?.title || item.title;
			let isP = item.references?.[0]?.entities_related_id?.person || item.person;
			person = isP ? `${isP}:` : '';
			return `CFP: ${person}${title}`;
		}
		default:
			person =
				item.references?.[0]?.entities_related_id?.person || item.person
					? `${item.references?.[0]?.entities_related_id?.person || item.person}:`
					: '';
			title = item.references?.[0]?.entities_related_id?.title || item.title;
			return `${person} ${title}`;
	}
}

export const linkHandler = (link, targetLocale = null) => {
	if (process.env.NODE_ENV === 'development') {
		return localizeHref(link, targetLocale ? { locale: targetLocale } : {});
	}

	if (link === '/') {
		return localizeHref(base, targetLocale ? { locale: targetLocale } : {});
	}

	if (link.startsWith('/')) {
		return localizeHref(base + link.slice(1), targetLocale ? { locale: targetLocale } : {});
	}
	return localizeHref(base + link, targetLocale ? { locale: targetLocale } : {});
};
