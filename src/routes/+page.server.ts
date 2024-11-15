import type { Actions } from './$types';
import { parseModelsFromFormData } from '$lib/server/utils/form.utils';
import { handleScraperError, validateBrand } from '$lib/server/utils/error.utils';
import { WORKERS_API_DOMAIN } from '$env/static/private';
import { client } from '$lib/server/services/qstash.service';

export const actions = {
	default: async ({ request, fetch }) => {
		try {
			const formData = await request.formData();
			const models = parseModelsFromFormData(formData);
			const brand = formData.get('brand');
			const emailTo = formData.get('emailTo');

			validateBrand(brand);

			const messageQueueResponse = await client.publishJSON({
				url: WORKERS_API_DOMAIN + '/scrape',
				method: 'POST',
				body: {
					models,
					brand,
					emailTo
				}
			});
			console.log('messagequeue response', messageQueueResponse);

			return {
				success: true
			};
		} catch (error) {
			return handleScraperError(error);
		}
	}
} satisfies Actions;
