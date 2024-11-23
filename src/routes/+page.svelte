<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import type { ActionData } from './$types';
	import { scrapeBillabong } from '$lib/scripts/billabong.scraper';
	import { scrapeRVCA } from '$lib/scripts/rvca.scraper';
	import { triggerDownload } from '$lib/utils/trigger-download.util';
	import type { ScrapedResult } from '$lib/types/scraped-result.type';
	import ScrapedModelsList from '$lib/ui/ScrapedModelsList.svelte';

	let isScrapeInProgress = false;
	let results: Array<ScrapedResult> = [];

	async function handleSubmit(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		const models = formData.get('models')?.toString().split('\n').filter(Boolean) || [];
		const brand = formData.get('brand')?.toString();

		if (!models.length || !brand) return;

		isScrapeInProgress = true;
		results = [];

		const scraper = brand === 'billabong' ? scrapeBillabong : scrapeRVCA;

		for (const model of models) {
			try {
				const materials = await scraper(model);
				results = [...results, { model, success: true, materials }];
			} catch (error) {
				results = [...results, { model, success: false }];
			}
		}

		triggerDownload({
			fileContents: generateCSV(results),
			filename: `${brand}-materials.csv`,
			contentType: 'text/csv'
		});

		isScrapeInProgress = false;
	}

	function generateCSV(data: typeof results): string {
		const headers = ['Model', 'Success', 'Materials'];
		const rows = data.map(({ model, success, materials }) =>
			[model, success.toString(), materials || ''].join(',')
		);
		return [headers.join(','), ...rows].join('\n');
	}
</script>

<div class="mb-4"></div>
<main class="flex flex-col items-center justify-center">
	<section class="mb-3 text-center">
		<h1 class="h1 mb-2">Netta's Automation 🚀</h1>
		<p>Paste a list of models, and we will scrape the product pages for the materials</p>
	</section>

	<form class="w-1/3" on:submit={handleSubmit}>
		<label class="label mb-2">
			<p>Models:</p>
			<textarea
				required
				name="models"
				class="textarea p-2"
				rows="10"
				placeholder="ABBBS00195
ABBBS00196
ABBBS00199
ABBBS00200
..."
				disabled={isScrapeInProgress}
			></textarea>
		</label>

		<div class="mx-auto flex w-fit gap-5">
			<label class="flex items-center space-x-2">
				<input
					class="radio"
					type="radio"
					checked
					name="brand"
					value="billabong"
					disabled={isScrapeInProgress}
				/>
				<p>Billabong</p>
			</label>
			<label class="flex items-center space-x-2">
				<input class="radio" type="radio" name="brand" value="rvca" disabled={isScrapeInProgress} />
				<p>RVCA</p>
			</label>
		</div>

		<div class="mt-4 text-center">
			<div class="mx-auto flex h-min w-fit">
				<button type="submit" disabled={isScrapeInProgress} class="variant-filled-primary btn">
					Submit
				</button>
				{#if isScrapeInProgress}
					<div class="ml-2 w-full">
						<ProgressRadial width={'w-10'} stroke={60} />
					</div>
				{/if}
			</div>
		</div>
	</form>

	<ScrapedModelsList {results} />
</main>
