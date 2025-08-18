import { readItems } from '@directus/sdk';
import { directus, hydrateTranslations, replaceTranslations } from '$lib/functions';
import { error } from '@sveltejs/kit';
import { getLocale } from '$lib/paraglide/runtime';
import { ASSET_URL } from '$lib/constants';
import { marked } from 'marked';
import { m } from '$lib/paraglide/messages';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, fetch, parent }) {
	const content = replaceTranslations(
		await directus.request(
			readItems('pages', {
				filter: { slug: { _eq: params.slug } },
				...hydrateTranslations(
					[
						'*',
						'content.page_content_id.*',
						'content.page_content_id.imagegrid_img.directus_files_id.id',
						'content.page_content_id.imagegrid_img.directus_files_id.title',
						'lists.memberlists_id.title',
						'lists.memberlists_id.listfile'
					],
					{},
					getLocale()
				)
			})
		),
		getLocale()
	);
	const replaceWithList = async (id) => {
		if (!id) return null;
		const res = await fetch(`${ASSET_URL}${id}?download=true`);
		let list = await res.json();
		if (list) {
			if (!Array.isArray(list)) {
				list = list.Sheet1;
			}
			return list;
		}
	};
	if (content[0]) {
		const { bgUrl } = await parent();
		const returnContent = await Promise.all([
			...(content[0]?.content.map(async (c) => {
				return {
					...c.page_content_id
				};
			}) || []),
			...(content[0]?.lists.map(async (l) => {
				console.log(l.memberlists_id);
				const list = await replaceWithList(l.memberlists_id.listfile);
				return {
					title: m[l.memberlists_id.title](),
					member_list: list || []
				};
			}) || [])
		]);
		return {
			meta: { title: content[0]?.title, description: await marked(content[0]?.description) },
			content: returnContent,
			randomIndex: Math.floor(Math.random() * bgUrl.length)
		};
	}
	error(404, { message: 'Page not found' });
}
