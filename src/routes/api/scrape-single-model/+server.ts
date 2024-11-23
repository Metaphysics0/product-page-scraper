import { scrapeBillabong } from '$lib/scripts/billabong.scraper';
import { scrapeRVCA } from '$lib/scripts/rvca.scraper';
import { isSupportedBrand, SupportedBrands } from '$lib/types/supported-brands.type';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET = (async ({ params }) => {
	const { model, brand } = params;

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
