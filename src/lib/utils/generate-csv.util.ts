import type { ScrapedResult } from '$lib/types/scraped-result.type';

export function generateCSV(data: ScrapedResult[]): string {
	const headers = ['Model', 'Materials'];
	const rows = data.map(({ model, materials }) => [model, materials || ''].join(','));
	return [headers.join(','), ...rows].join('\n');
}
