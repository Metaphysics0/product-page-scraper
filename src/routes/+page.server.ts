import type { Actions } from './$types';
import { parseModelsFromFormData } from '$lib/server/utils/form.utils';
import { fail } from '@sveltejs/kit';
import { validateBrand } from '$lib/server/utils/validation.utils';

export const actions = {
	default: async ({ request, fetch }) => {
		try {
			const formData = await request.formData();
			const models = parseModelsFromFormData(formData);
			const brand = formData.get('brand');
			validateBrand(brand);

			// console.log('Queued message', messageQueueResponse);

			return { success: true };
		} catch (error) {
			console.error('Error submitting request', error);
			return fail(500, { success: false, message: 'An error occurred!' });
		}
	}
} satisfies Actions;
