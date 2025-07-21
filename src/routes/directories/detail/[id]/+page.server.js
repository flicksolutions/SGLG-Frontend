import { directus, hydrateTranslations, replaceTranslations } from '$lib/functions';
import { getLocale } from '$lib/paraglide/runtime';
import { readItem, readItems } from '@directus/sdk';
/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	try {
		let fields = [
			'*',
			'itemtype.*',
			'references.entities_related_id',
			'referenced_by.entities_id.*',
			'referenced_by.entities_id.itemtype.*',
			'files.directus_files_id',
			'image.id',
			'image.title'
		];
		let item = replaceTranslations(
			await directus.request(
				readItem('entities', params.id, hydrateTranslations(fields, {}, getLocale()))
			),
			getLocale()
		);

		if (item.references?.[0]?.entities_related_id) {
			console.log('theres no title! returning the referenced object instead.', params.id);
			item = await directus.request(
				readItem('entities', item.references?.[0].entities_related_id, {
					fields: ['*', 'itemtype.*', 'image.id', 'image.title']
				})
			);
		}
		return { item };
	} catch (err) {
		console.log(err);
		this.error(403, 'No Permission');
	}
}

/** @type {import('./$types').EntryGenerator} */
export async function entries() {
	const ids = await directus.request(
		readItems('entities', {
			fields: ['id'],
			// filter: {
			// 	status: {
			// 		_eq: 'published'
			// 	}
			// },
			limit: -1
		})
	);
	return ids.map((i) => ({
		id: i.id.toString()
	}));
}
