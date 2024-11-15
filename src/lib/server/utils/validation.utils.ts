import { isSupportedBrand, SupportedBrands } from '$lib/types/supported-brands.type';

export function validateBrand(brand: unknown): asserts brand is SupportedBrands {
	if (!isSupportedBrand(brand)) {
		throw new Error(
			`Invalid brand: ${brand}. Supported brands are: ${Object.values(SupportedBrands).join(', ')}`
		);
	}
}
