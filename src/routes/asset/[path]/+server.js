export const prerender = true;

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, fetch }) {
	const { path } = params;
	const splitPath = path.split('==');
	const renderedPath = splitPath[0];
	const renderedSearchParams = new URLSearchParams(splitPath[1] || '');
	return fetch(
		`https://misty-frank-flicksolutions-b4bb2a19.koyeb.app/assets/${renderedPath}?${renderedSearchParams.toString()}`
	);
}
