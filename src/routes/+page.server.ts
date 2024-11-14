import type { Actions } from './$types';
import { ScraperService } from '$lib/server/services/scraper.service';
import { parseModelsFromFormData, createFileNameFromBrand } from '$lib/server/utils/form.utils';
import { handleScraperError, validateBrand } from '$lib/server/utils/error.utils';

export const actions = {
	default: async ({ request }) => {
		try {
			const formData = await request.formData();
			const models = parseModelsFromFormData(formData);
			const brand = formData.get('brand');

			validateBrand(brand);

			const results = await ScraperService.scrapeModels({ brand, models });

			return {
				success: true,
				fileName: createFileNameFromBrand(brand),
				results
			};
		} catch (error) {
			return handleScraperError(error);
		}
	}
} satisfies Actions;
