import { getLocale } from '$lib/paraglide/runtime';
import { readItems, readSingleton } from '@directus/sdk';
import { directus, replaceTranslations } from '$lib/functions';
import { marked } from 'marked';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const directoryObjects = await directus.request(readItems('directories'));
	const content = replaceTranslations(
		await directus.request(
			readSingleton('Highlights', {
				fields: [
					'title',
					'description',
					'columns',
					'translations.description',
					'translations.title'
				],
				deep: {
					translations: {
						_filter: {
							languages_code: {
								_eq: getLocale()
							}
						}
					}
				}
			})
		),
		getLocale()
	);

	const config = {
		fields: [
			'id',
			'itemtype.directory',
			'title',
			'date',
			'event_type',
			'image.id',
			'image.title',
			'image.type'
		],
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
	).map((item) => {
		if (item?.image?.type.endsWith('pdf')) {
			delete item.image; // Remove the id for PDF images to avoid broken links
		}
		return item;
	});

	return {
		content: {
			title: content.title,
			columns: content.columns,
			description: marked(content.description)
		},
		items
	};
}
