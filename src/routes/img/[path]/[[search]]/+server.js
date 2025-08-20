export const prerender = true;

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, fetch }) {
	const { path, search } = params;
	const renderedSearchParams = new URLSearchParams(search);
	return fetch(
		`https://misty-frank-flicksolutions-b4bb2a19.koyeb.app/assets/${path}?${renderedSearchParams.toString()}`
	);
}
