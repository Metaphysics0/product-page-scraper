export enum SupportedBrands {
	BILLABONG = 'billabong',
	RVCA = 'rvca'
}

export function isSupportedBrand(brand: unknown): brand is SupportedBrands {
	return brand === SupportedBrands.BILLABONG || brand === SupportedBrands.RVCA;
}
