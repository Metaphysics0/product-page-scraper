import { scrapeMaterialDetailsFromBillabong } from './scrape-billabong-product-pages-for-material-details';

export async function scrapeBillabong(model: string): Promise<string> {
	return scrapeMaterialDetailsFromBillabong(model);
}
