import pLimit from 'p-limit';
import { chunk } from 'lodash-es';
import type { ProductDetails } from '../types/product-details.type';
import { CSV_HEADERS } from '../constants/csv-headers.constant';

export abstract class BaseScraper {
	protected readonly modelChunks: string[][];
	protected readonly limit: ReturnType<typeof pLimit>;
	protected readonly CONCURRENT_REQUESTS = 10;

	constructor({ models }: { models: string[] }) {
		console.log('Splitting models into chunks of 100');
		this.modelChunks = chunk(models, 100);
		this.limit = pLimit(this.CONCURRENT_REQUESTS);
	}

	public async scrape(): Promise<string> {
		const results = await Promise.all(
			this.modelChunks.map((chunk) => this.getProductDetailsForModels(chunk))
		);

		return this.createCSVAndRemoveDuplicates(results);
	}

	protected abstract getSearchResult(model: string): Promise<any>;
	protected abstract getProductDetails(model: string, searchResult: any): Promise<ProductDetails[]>;

	protected async getProductDetailsForModels(models: string[] = []): Promise<ProductDetails[]> {
		const tasks = models.map((model, index) => {
			return this.limit(async () => {
				console.log(`Queuing model ${index + 1}/${models.length}:`, model);
				const searchResult = await this.getSearchResult(model);
				return this.getProductDetails(model, searchResult);
			});
		});

		const results = await Promise.all(tasks);
		return results.flat();
	}

	protected createCSVAndRemoveDuplicates(results: ProductDetails[][]): string {
		const flatResults = results.flat();
		const uniqueResults = this.removeDuplicates(flatResults);
		return this.convertToCSV(uniqueResults);
	}

	private removeDuplicates(results: ProductDetails[]): ProductDetails[] {
		return results.reduce((acc: ProductDetails[], current) => {
			if (!acc.find((item) => item.model === current.model)) {
				acc.push(current);
			}
			return acc;
		}, []);
	}

	private convertToCSV(results: ProductDetails[]): string {
		const csvRows = results.map(
			({ model, materialTexts }) => `${model},"${materialTexts.replace(/"/g, '""')}"`
		);

		return [CSV_HEADERS, ...csvRows].join('\n');
	}
}
