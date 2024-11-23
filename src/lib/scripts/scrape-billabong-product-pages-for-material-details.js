// @ts-nocheck
import { NOT_FOUND_TEXT } from '$lib/constants/not-found-text.constant';

async function getSearchResult(model) {
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

async function getProductDetails(model, searchResult) {
	let results = [];
	const baseProductPageUrl = 'https://www.billabong.com';
	for (const result of searchResult.results) {
		const productPageResponse = await fetch(baseProductPageUrl + '/' + result.url);
		const productPage = await productPageResponse.text();
		const productPageDocument = new DOMParser().parseFromString(productPage, 'text/html');

		if (
			productPageDocument.getElementsByClassName('style')[0].innerText.split('Style ').at(-1) !==
			model
		) {
			results.push({
				model,
				materialTexts: NOT_FOUND_TEXT
			});
			continue;
		}

		const materialTexts = Array.from(
			productPageDocument.getElementsByClassName('accordion-panel')[1].getElementsByTagName('p')
		).at(-1).innerText;

		results.push({ model, materialTexts });
	}
	return results;
}

function createCSVAndRemoveDuplicates(results) {
	const relevantResults = results.filter((result) => result.materialTexts !== 'Features');
	const csvRows = relevantResults.map(
		({ model, materialTexts }) => `${model},"${materialTexts.replace(/"/g, '""')}"`
	);
	return ['model,materialText', ...csvRows].join('\n');
}

function getFirstRelevantResult(results) {
	return (
		results.filter((result) => result.materialTexts !== 'Features').at(0)?.materialTexts ||
		NOT_FOUND_TEXT
	);
}

export async function scrapeMaterialDetailsFromBillabong(model) {
	console.log(`Scraping Billabong model`, model);
	const searchResult = await getSearchResult(model);
	const productDetails = await getProductDetails(model, searchResult);

	return getFirstRelevantResult(productDetails);
}
