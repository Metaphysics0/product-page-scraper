import { WORKERS_API_DOMAIN } from '$env/static/private';
import { scrapeBillabong } from '$lib/scripts/billabong.scraper';
import { scrapeRVCA } from '$lib/scripts/rvca.scraper';
import { isSupportedBrand, SupportedBrands } from '$lib/types/supported-brands.type';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET = (async ({ url }) => {
	const model = url.searchParams.get('model');
	const brand = url.searchParams.get('brand');

	if (!model) {
		return error(403, { message: 'missing model' });
	}

	if (!isSupportedBrand(brand)) {
		return error(403, { message: 'non supported brand' });
	}

	const scraper = brand === SupportedBrands.BILLABONG ? scrapeBillabong : scrapeRVCA;
	const materials = await scraper(model);

	return json({
		materials
	});
}) satisfies RequestHandler;

export const POST = (async ({ request, fetch }) => {
	const body = await request.json();
	const responseFromCf = await fetch(WORKERS_API_DOMAIN + '/scrape', {
		method: 'POST',
		body: JSON.stringify(body)
	});

	const result = await responseFromCf.json();

	return json(result);
}) satisfies RequestHandler;
