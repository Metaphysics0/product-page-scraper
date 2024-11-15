import type { Actions } from './$types';
import { parseModelsFromFormData } from '$lib/server/utils/form.utils';
import { WORKERS_API_DOMAIN } from '$env/static/private';
import { client } from '$lib/server/services/qstash.service';
import { fail } from '@sveltejs/kit';
import { validateBrand } from '$lib/server/utils/validation.utils';

export const actions = {
	default: async ({ request }) => {
		try {
			const formData = await request.formData();
			const models = parseModelsFromFormData(formData);
			const brand = formData.get('brand');
			validateBrand(brand);

			const emailTo = formData.get('emailTo');
			if (!emailTo) {
				throw new Error('Missing required param emailTo');
			}

			const messageQueueResponse = await client.publishJSON({
				url: WORKERS_API_DOMAIN + '/scrape',
				method: 'POST',
				body: { models, brand, emailTo }
			});

			console.log('Queued message', messageQueueResponse);

			return { success: true };
		} catch (error) {
			console.error('Error submitting request', error);
			return fail(500, { success: false, message: 'An error occurred!' });
		}
	}
} satisfies Actions;
