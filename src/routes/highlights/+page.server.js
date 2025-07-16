import { getLocale } from '$lib/paraglide/runtime';
import { readItems } from '@directus/sdk';
import { directus, replaceTranslations } from '$lib/functions';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const directoryObjects = await directus.request(readItems('directories'));

	const config = {
		fields: ['id', 'itemtype.directory', 'title', 'date', 'event_type', 'image.id', 'image.title'],
		filter: {
			itemtype: {
				directory: {
					_in: directoryObjects.map((d) => d.directory)
				}
			},
			image: {
				_nnull: true
			},
			internal: {
				_eq: true
			}
		},
		deep: {},
		sort: '-date',
		limit: -1
	};

	if (getLocale() !== 'de') {
		config.fields.push('translations.*');
		config.deep.translations = {
			_filter: {
				languages_code: {
					_eq: getLocale()
				}
			}
		};
	}

	const items = replaceTranslations(
		await directus.request(readItems('entities', config)),
		getLocale()
	);
	return { items };
}
