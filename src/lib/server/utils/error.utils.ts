import { fail } from '@sveltejs/kit';
import { isSupportedBrand, SupportedBrands } from '$lib/types/supported-brands.type';

export function handleScraperError(error: unknown) {
	console.error('Scraper error:', error);

	return fail(500, {
		success: false,
		message: 'An error occurred while scraping'
	});
}

export function validateBrand(brand: unknown): asserts brand is SupportedBrands {
	if (!isSupportedBrand(brand)) {
		throw new Error(
			`Invalid brand: ${brand}. Supported brands are: ${Object.values(SupportedBrands).join(', ')}`
		);
	}
}
