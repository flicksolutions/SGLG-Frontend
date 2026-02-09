import { readItems } from '@directus/sdk';
import { directus, hydrateTranslations, getBg } from '$lib/functions';
import { getLocale } from '$lib/paraglide/runtime';
import { error } from '@sveltejs/kit';

export const prerender = true;

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
	console.log('Loading layout');
	const fields = ['title', 'content.page_content_id.title', 'content.page_content_id.slug', 'slug'];
	const deep = {
		content: {
			page_content_id: {
				_filter: {
					menu: {
						_eq: true
					}
				}
			}
		}
	};

	try {
		const bgUrl = await getBg();
		const res = await directus.request(
			readItems('pages', { ...hydrateTranslations(fields, deep, getLocale()) })
		);
		const pages = res.map((p) => {
			if (p.translations?.length) {
				p.translations[0].subPages = p.translations[0]?.content
					?.map((c) => c.page_content_id)
					.filter((c) => c);
				return { ...p.translations[0], slug: p.slug };
			} else {
				p.subPages = p.content.map((c) => c.page_content_id).filter((c) => c);
				delete p.content;
				return p;
			}
		});
		return { pages, bgUrl };
	} catch (err) {
		console.log(err);
		error(403, 'No Permission');
	}
}
