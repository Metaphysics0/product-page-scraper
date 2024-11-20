// @ts-nocheck
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
		searchResult.results.length > 0
			? searchResult.results
			: [
					{
						url: searchResult.singleResult
					}
				];

	for (const result of searchResults) {
		const productPageResponse = await fetch(baseProductPageUrl + '/' + result.url);
		const productPage = await productPageResponse.text();
		const productPageDocument = new DOMParser().parseFromString(productPage, 'text/html');

		const productModel = productPageDocument
			.getElementsByClassName('style')[0]
			.innerText.split('Style ')
			.at(-1);

		if (productModel !== model) {
			console.log('Model not found:', productModel, model);
			results.push({ model, materialTexts: 'NOT FOUND' });
			continue;
		}

		const materialTexts = Array.from(
			productPageDocument.getElementsByClassName('accordion-panel')[1].getElementsByTagName('p')
		).at(-1).innerText;

		console.log('Material text:', materialTexts);

		results.push({ model, materialTexts });
	}
	return results;
}

const models = [
	'ABJKT00515',
	'ABJKT00572',
	'ABYWT00268',
	'ABYZT02314',
	'ABYZT02314',
	'ABYZT02363',
	'ABYZT02364',
	'ABYZT02365',
	'ABYZT02366',
	'ABYZT02367',
	'ABYZT02368',
	'ABYZT02369',
	'ABYZT02370',
	'ABYZT02372',
	'ABYZT02373',
	'ABYZT02374',
	'ABYZT02401',
	'ABYZT02514',
	'ABYZT02514',
	'ABYZT02515',
	'ABYZT02518',
	'UBYZT00516',
	'ABGNS00106',
	'ABGNS00106',
	'ABYTK03005',
	'ABYTK03006',
	'ABYWS00224',
	'ABYWS00225',
	'G203JMAD',
	'ABYFT00474',
	'ABYSF00122',
	'ABYSF00123',
	'ABJX300981',
	'ABJX300994',
	'ABJX400214',
	'ABJX400307',
	'ABJX400507',
	'ABJX400901',
	'ABJX400981',
	'ABJX401018',
	'ABYBS00450',
	'ABYBS00453',
	'ABYBS00454',
	'ABYBS00455',
	'ABYBS00459',
	'ABYBS00464',
	'ABYBS00468',
	'ABYBS00485',
	'ABYBS00488',
	'ABYBS00489',
	'ABYBS00496',
	'ABYBS00500',
	'ABYJV00135',
	'ABYJV00135'
];

const results = [];

for (const [index, model] of models.entries()) {
	console.log(`Scraping model ${index + 1}/${models.length}:`, model);
	const searchResult = await getSearchResult(model);
	const productDetails = await getProductDetails(model, searchResult);
	results.push(...productDetails);
}

function createCSVAndRemoveDuplicates(results) {
	const flatResults = results.flat();
	const uniqueResults = flatResults.reduce((acc, current) => {
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

await Deno.writeTextFile('rvca-material-details.csv', createCSVAndRemoveDuplicates(results));
