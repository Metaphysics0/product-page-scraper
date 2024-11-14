import { chunk } from 'lodash';
import { JSDOM } from 'jsdom';

interface ProductDetails {
	model: string;
	materialTexts: string;
}

export class BillabongScraper {
	private readonly modelChunks: string[][];

	constructor({ models }: { models: string[] }) {
		console.log('Splitting models into chunks of 100');
		this.modelChunks = chunk(models, 100);
	}

	public async scrape(): Promise<string> {
		const results = await Promise.all(
			this.modelChunks.map((chunk) => this.getProductDetailsForModels(chunk))
		);

		return this.createCSVAndRemoveDuplicates(results);
	}

	private async getSearchResult(model: string) {
		const searchResponse = await fetch(
			`https://v5bvb8.a.searchspring.io/api/search/search.json?siteId=v5bvb8&resultsFormat=native&resultsPerPage=24&bgfilter.=undefined&page=1&q=${model}`,
			{
				headers: {
					accept: '*/*',
					'accept-language': 'en-US,en;q=0.9',
					priority: 'u=1, i',
					'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'empty',
					'sec-fetch-mode': 'cors',
					'sec-fetch-site': 'cross-site'
				},
				referrer: 'https://www.billabong.com/',
				referrerPolicy: 'strict-origin-when-cross-origin',
				body: null,
				method: 'GET',
				mode: 'cors',
				credentials: 'omit'
			}
		);
		return searchResponse.json();
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private async getProductDetails(model: string, searchResult: any): Promise<ProductDetails[]> {
		const results: ProductDetails[] = [];
		const baseProductPageUrl = 'https://www.billabong.com';

		for (const result of searchResult.results) {
			const productPageResponse = await fetch(baseProductPageUrl + '/' + result.url);
			const productPage = await productPageResponse.text();
			const { window } = new JSDOM(productPage);
			const document = window.document;

			const styleElement = document.getElementsByClassName('style')[0] as HTMLElement;
			if (styleElement?.textContent?.split('Style ').at(-1) !== model) {
				results.push({
					model,
					materialTexts: 'NOT FOUND'
				});
				continue;
			}

			const accordionPanel = document.getElementsByClassName('accordion-panel')[1];
			const paragraphs = accordionPanel?.getElementsByTagName('p');
			const lastParagraph = paragraphs && (Array.from(paragraphs).at(-1) as HTMLElement);
			const materialTexts = lastParagraph?.textContent || 'NOT FOUND';

			results.push({ model, materialTexts });
		}
		return results;
	}

	private async getProductDetailsForModels(models: string[] = []): Promise<ProductDetails[]> {
		const results: ProductDetails[] = [];
		for (const [index, model] of models.entries()) {
			console.log(`Scraping model ${index + 1}/${models.length}:`, model);
			const searchResult = await this.getSearchResult(model);
			const productDetails = await this.getProductDetails(model, searchResult);
			results.push(...productDetails);
		}
		return results;
	}

	private createCSVAndRemoveDuplicates(results: ProductDetails[][]): string {
		const flatResults = results.flat();
		const uniqueResults = flatResults.reduce((acc: ProductDetails[], current) => {
			if (!acc.find((item) => item.model === current.model)) {
				acc.push(current);
			}
			return acc;
		}, []);

		const csvRows = uniqueResults.map(
			({ model, materialTexts }) => `${model},"${materialTexts.replace(/"/g, '""')}"`
		);
		return ['model,materialText', ...csvRows].join('\n');
	}
}
