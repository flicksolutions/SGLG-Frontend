import { directus } from '$lib/functions';
import { readItems, readSingleton } from '@directus/sdk';
import { getLocale } from '$lib/paraglide/runtime';
import { marked } from 'marked';
import { hydrateTranslations } from '$lib/functions';
import { m } from '$lib/paraglide/messages';

/** @type {import('./$types').PageServerLoad} */
export async function load({ parent }) {
	console.log('Loading homepage');
	const disturberData = await directus.request(
		readItems('disturber', { limit: 1, ...hydrateTranslations(['*'], {}, getLocale()) })
	);
	let disturberLabel = await marked(
		disturberData[0]?.translations[0]?.label || disturberData[0]?.label || ''
	);
	let disturberLink = disturberData[0]?.translations[0]?.link || disturberData[0]?.link || '';

	//get the content
	let fields = [
		'content',
		'items.id',
		'items.internal',
		'items.references.entities_related_id.title',
		'items.references.entities_related_id.id',
		'items.references.entities_related_id.person',
		'items.references.entities_related_id.internal',
		'items.itemtype.directory',
		'items.content',
		'items.title',
		'items.person',
		'items.date',
		'items.event_type',
		'items.publication_type'
	];
	let deep = { items: { _sort: '-date' } };
	if (getLocale() !== 'de') {
		// if we are not in default locale, we need to get the translations of the items
		fields.push('translations.content', 'items.translations.title', 'items.translations.content');
		const trans = {
			_filter: {
				languages_code: {
					_eq: getLocale()
				}
			}
		};
		deep.items.translations = trans;
		deep.translations = trans;
	}

	const homepageData = await directus.request(readSingleton('homepage', { fields, deep }));
	const items = homepageData.items.map((i) => {
		//we set the items to display on the page. For that we consume the items from the response.
		let cleanItem = {
			//it may look funny to fiddle around with the items. but the reason is translation. I do this here because I want my html nice and understandable.
			...i,
			...i.translations?.[0] //but also replace any translatable fields with the translated ones.
		};
		if (i.references[0]?.entities_related_id?.title) {
			cleanItem.title = m[`${i.itemtype.directory}_title`]({
				title: i.references[0].entities_related_id.title
			});
			cleanItem.internal = i.references[0].entities_related_id.internal;
		}
		return cleanItem;
	});
	const content = homepageData?.translations?.[0]?.content || homepageData?.content || [];
	const randomIndex = Math.floor(Math.random() * (await parent()).bgUrl.length);

	return { disturberLabel, disturberLink, items, content, randomIndex };
}
