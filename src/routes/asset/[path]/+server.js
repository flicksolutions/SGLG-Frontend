export const prerender = true;
import { PUBLIC_API } from '$env/static/public';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, fetch }) {
	const { path } = params;
	const splitPath = path.split('==');
	const renderedPath = splitPath[0];
	const renderedSearchParams = new URLSearchParams(splitPath[1] || '');
	const res = await fetch(
		`${PUBLIC_API}/assets/${renderedPath}?${renderedSearchParams.toString()}`
	);
	return new Response(res.body);
}
