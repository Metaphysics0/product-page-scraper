import { PUBLIC_WORKERS_API_DOMAIN } from '$env/static/public';
import type { SupportedBrands } from '$lib/types/supported-brands.type';
import _ from 'lodash-es';

export async function scrapeModelsFromCf({
	brand,
	models
}: {
	brand: SupportedBrands;
	models: string[];
}): Promise<CfScrapeResult[]> {
	try {
		const modelChunks = _.chunk(models, 5);
		const results = await Promise.all(modelChunks.map((models) => call({ models, brand })));
		return results.flat();
	} catch (error) {
		console.error('error scraping', error);

		return [];
	}
}

async function call(params: CfScrapeParams) {
	const response = await fetch(`${PUBLIC_WORKERS_API_DOMAIN}/scrape`, {
		method: 'POST',
		body: JSON.stringify(params)
	});
	const { result } = (await response.json()) as { result: CfScrapeResult[] };
	return result;
}

interface CfScrapeResult {
	model: string;
	materialTexts: string;
}

interface CfScrapeParams {
	brand: SupportedBrands;
	models: string[];
}
