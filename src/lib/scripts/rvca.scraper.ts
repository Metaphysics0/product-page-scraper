import { scrapeMaterialDetailsFromRVCA } from './scrape-rvca-product-pages-for-material-details';

export async function scrapeRVCA(model: string): Promise<string> {
	return scrapeMaterialDetailsFromRVCA(model);
}
