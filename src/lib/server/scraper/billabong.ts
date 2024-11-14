import { BaseScraper } from './base-scraper';
import Fetcher from '../utils/fetcher';
import { createDOM, extractMaterialText, extractStyleModel } from '../utils/dom-utils';
import type { ProductDetails } from '../types/product-details.type';
import { NOT_FOUND_TEXT } from '../constants/not-found-text.constant';

export class BillabongScraper extends BaseScraper {
	private readonly baseProductPageUrl = 'https://www.billabong.com';

	protected async getSearchResult(model: string) {
		const searchResponse = await new Fetcher().fetch(
			`https://v5bvb8.a.searchspring.io/api/search/search.json?siteId=v5bvb8&resultsFormat=native&resultsPerPage=24&bgfilter.=undefined&page=1&q=${model}`,
			{ referrer: 'https://www.billabong.com/' }
		);
		return searchResponse.json();
	}

	protected async getProductDetails(model: string, searchResult: any): Promise<ProductDetails[]> {
		const results: ProductDetails[] = [];

		for (const result of searchResult.results) {
			const productPageResponse = await new Fetcher().fetch(
				this.baseProductPageUrl + '/' + result.url
			);
			const productPage = await productPageResponse.text();
			const document = await createDOM(productPage);

			const productModel = extractStyleModel(document);
			if (productModel !== model) {
				results.push({ model, materialTexts: NOT_FOUND_TEXT });
				continue;
			}

			const materialTexts = extractMaterialText(document);
			results.push({ model, materialTexts });
		}
		return results;
	}
}
