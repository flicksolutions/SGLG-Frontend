import { directus } from '$lib/functions';
import { readItems } from '@directus/sdk';
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
