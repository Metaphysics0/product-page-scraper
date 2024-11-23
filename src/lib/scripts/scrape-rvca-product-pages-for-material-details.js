// @ts-nocheck
import { NOT_FOUND_TEXT } from '$lib/constants/not-found-text.constant';
import { createDOM, extractMaterialText, extractStyleModel } from '$lib/server/utils/dom-utils';

const searchUrl =
	'https://d7fc3x.a.searchspring.io/api/search/search.json?siteId=d7fc3x&resultsFormat=native&resultsPerPage=24&bgfilter.=undefined&page=1';

async function getSearchResult(model) {
	const searchResponse = await fetch(searchUrl + '&q=' + model, {
		headers: {
			accept: '*/*',
			'accept-language': 'en-US,en;q=0.9',
			priority: 'u=1, i',
			'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
			'sec-ch-ua-mobile': '?0',
			'sec-ch-ua-platform': '"macOS"',
			'sec-fetch-dest': 'empty',
			'sec-fetch-mode': 'cors',
			'sec-fetch-site': 'cross-site'
		},
		referrer: 'https://www.rvca.com/',
		referrerPolicy: 'strict-origin-when-cross-origin',
		body: null,
		method: 'GET',
		mode: 'cors',
		credentials: 'omit'
	});
	return searchResponse.json();
}

async function getProductDetails(model, searchResult) {
	let results = [];
	const baseProductPageUrl = 'https://www.rvca.com';

	const searchResults =
		searchResult.results.length > 0 ? searchResult.results : [{ url: searchResult.singleResult }];

	for (const result of searchResults) {
		const productPageResponse = await fetch(baseProductPageUrl + '/' + result.url);
		const productPage = await productPageResponse.text();
		// const productPageDocument = new DOMParser().parseFromString(productPage, 'text/html');
		const productPageDocument = createDOM(productPage);

		const productModel = extractStyleModel(productPageDocument);
		console.log('PRODUCT MODEL', productModel);

		if (productModel !== model) {
			console.log('Model not found:', productModel, model);
			results.push({ model, materialTexts: NOT_FOUND_TEXT });
			continue;
		}

		const materialTexts = extractMaterialText(productPageDocument);

		console.log('Material text:', materialTexts);
		results.push({ model, materialTexts });
	}
	return results;
}

function getFirstRelevantResult(results) {
	return results.at(0)?.materialTexts || NOT_FOUND_TEXT;
}

export async function scrapeMaterialDetailsFromRVCA(model) {
	console.log(`Scraping RVCA model`, model);
	const searchResult = await getSearchResult(model);
	const productDetails = await getProductDetails(model, searchResult);

	return getFirstRelevantResult(productDetails);
}
