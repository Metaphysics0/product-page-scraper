import { BillabongScraper } from '../scraper/billabong';
import { RVCAScraper } from '../scraper/rvca';
import type { SupportedBrands } from '$lib/types/supported-brands.type';

export class ScraperService {
	static async scrapeModels({
		models,
		brand
	}: {
		models: string[];
		brand: SupportedBrands;
	}): Promise<string> {
		const scraper = this.getScraperClassFromBrand(brand, models);
		return scraper.scrape();
	}

	private static getScraperClassFromBrand(brand: SupportedBrands, models: string[]) {
		const scrapers = {
			billabong: BillabongScraper,
			rvca: RVCAScraper
		};

		const ScraperClass = scrapers[brand];
		if (!ScraperClass) {
			throw new Error(`No scraper found for brand: ${brand}`);
		}

		return new ScraperClass({ models });
	}
}
