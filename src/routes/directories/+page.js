import { directus, hydrateTranslations, replaceTranslations } from '$lib/functions';
import { getLocale } from '$lib/paraglide/runtime';
import { readItems, readSingleton } from '@directus/sdk';

/** @type {import('./$types').PageLoad} */
export async function load() {
	const directoryObjects = await directus.request(readItems('directories'));

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
	return { directoryObjects, currentNl, nlDescription, nlTitle };
}
