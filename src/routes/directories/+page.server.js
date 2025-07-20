import { directus, hydrateTranslations, replaceTranslations } from '$lib/functions';
import { getLocale } from '$lib/paraglide/runtime';
import { readItems, readSingleton } from '@directus/sdk';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const directories = await directus.request(readItems('directories'));
	let allItems = await directus.request(
		readItems('entities', {
			fields: [
				'id',
				'itemtype.directory',
				'references.entities_related_id.title',
				'references.entities_related_id.id',
				...Array.from(new Set(directories.flatMap((d) => d.frontend_fields)))
			],
			limit: -1
		})
	);

	allItems = allItems.map((item) => {
		if (item.itemtype?.directory) {
			item.itemtype = item.itemtype.directory;
		}
		return item;
	});

	const {
		string: currentNl,
		description: nlDescription,
		title: nlTitle
	} = replaceTranslations(
		await directus.request(
			readSingleton('current_newsletter', {
				...hydrateTranslations(['string', 'description', 'title'], {}, getLocale())
			})
		),
		getLocale()
	);
	return { directories, currentNl, nlDescription, nlTitle, allItems };
}
