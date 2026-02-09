export const prerender = true;
import { PUBLIC_API } from '$env/static/public';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, fetch }) {
	console.log('Fetching asset with path:', params.path);
	const { path } = params;
	const splitPath = path.split('==');
	const renderedPath = splitPath[0];
	const renderedSearchParams = new URLSearchParams(splitPath[1] || '');
	const body = await fetch(
		`${PUBLIC_API}/assets/${renderedPath}?${renderedSearchParams.toString()}`
	).then((res) => res.body);
	return new Response(body);
}
