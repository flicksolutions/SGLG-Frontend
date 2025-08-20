export const prerender = true;

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, fetch, url }) {
	const { path } = params;
	return fetch(
		`https://misty-frank-flicksolutions-b4bb2a19.koyeb.app/assets/${path}?${url.searchParams.toString()}`
	);
}
