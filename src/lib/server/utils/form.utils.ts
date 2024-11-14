export function parseModelsFromFormData(formData: FormData): string[] {
	const models = formData.get('models');
	if (!models) {
		throw new Error('Models are required');
	}

	return models.toString().split('\n').filter(Boolean);
}

export function createFileNameFromBrand(brand: string): string {
	const timestamp = new Date().toLocaleDateString().replaceAll('/', '-');
	return `${brand}-materials-${timestamp}.csv`;
}
