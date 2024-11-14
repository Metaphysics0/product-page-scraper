import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { BillabongScraper } from '$lib/server/scraper/billabong';
import { isSupportedBrand, SupportedBrands } from '$lib/types/supported-brands.type';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const models = data.get('models');
		const brand = data.get('brand');

		if (!models) return fail(400, { error: 'Models are required' });

		if (!isSupportedBrand(brand)) {
			throw new Error(
				`Invalid brand: ${brand}. Supported brands are: ${Object.values(SupportedBrands).join(', ')}`
			);
		}

		try {
			const modelsList = models.toString().split('\n').filter(Boolean);
			const results = await getResults({
				brand,
				models: modelsList
			});

			return {
				success: true,
				fileName: createFileNameFromBrand(brand),
				results
			};
		} catch (error) {
			console.log('error', error);

			return fail(500, { message: 'unknown server error' });
		}
	}
} satisfies Actions;

async function getResults({
	models,
	brand
}: {
	models: string[];
	brand: SupportedBrands;
}): Promise<string> {
	switch (brand) {
		case SupportedBrands.BILLABONG: {
			const scraper = new BillabongScraper({ models });
			return scraper.scrape();
		}

		case SupportedBrands.RVCA: {
			const scraper = new BillabongScraper({ models });
			return scraper.scrape();
		}
		default: {
			throw new Error('unsupported brand');
		}
	}
}

function createFileNameFromBrand(brand: string): string {
	return `${brand}_materials_download_${new Date().toLocaleDateString().replaceAll('/', '-')}.csv`;
}
