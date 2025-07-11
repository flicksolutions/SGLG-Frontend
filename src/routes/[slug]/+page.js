import { readItems } from '@directus/sdk';
import { directus, hydrateTranslations, replaceTranslations } from '$lib/functions';
import { error } from '@sveltejs/kit';
import { getLocale } from '$lib/paraglide/runtime';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const content = replaceTranslations(
		await directus.request(
			readItems('pages', {
				filter: { slug: { _eq: params.slug } },
				...hydrateTranslations(
					[
						'*',
						'content.page_content_id.*',
						'content.page_content_id.imagegrid_img.directus_files_id.id',
						'content.page_content_id.imagegrid_img.directus_files_id.title'
					],
					{},
					getLocale()
				)
			})
		),
		getLocale()
	);
	if (content[0]) {
		return { meta: content[0], content: content[0]?.content.map((c) => c.page_content_id) };
	}
	error(404, { message: 'Page not found' });
}
