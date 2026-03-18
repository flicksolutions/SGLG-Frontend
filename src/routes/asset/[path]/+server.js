export const prerender = true;
import { PUBLIC_API } from '$env/static/public';
import { fetchWithRetry } from '$lib/functions';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, fetch }) {
	const { path } = params;
	const splitPath = path.split('==');
	const renderedPath = splitPath[0];
	const renderedSearchParams = new URLSearchParams(splitPath[1] || '');
	const body = await fetchWithRetry(
		`${PUBLIC_API}/assets/${renderedPath}?${renderedSearchParams.toString()}`,
		{},
		fetch
	).then((res) => res.body);
	return new Response(body);
}
