<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { triggerDownload } from '$lib/utils/trigger-download.util';
	import type { ScrapedResult } from '$lib/types/scraped-result.type';
	import ResultsList from '$lib/ui/ResultsList.svelte';
	import { SupportedBrands } from '$lib/types/supported-brands.type';
	import { generateCSV } from '$lib/utils/generate-csv.util';
	import { fade } from 'svelte/transition';
	import { parseModelsFromFormData } from '$lib/utils/form.utils';
	import { validateBrand } from '$lib/utils/validation.utils';
	import RadioButton from '$lib/ui/common/RadioButton.svelte';
	import Header from '$lib/ui/Header.svelte';
	import { scrapeModelsFromCf } from '$lib/utils/scrape-from-cf-endpoint.util';

	let isScrapeInProgress = false;
	let results: Array<ScrapedResult> = [];

	let hasSubmittedForm = false;

	async function handleSubmit(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		const models = parseModelsFromFormData(formData);
		const brand = formData.get('brand');
		validateBrand(brand);

		if (!models.length || !brand) return;

		isScrapeInProgress = true;
		results = [];

		const result = await scrapeModelsFromCf({ models, brand });
		results = result.map((a) => ({
			success: true,
			model: a.model,
			materials: a.materialTexts
		}));

		triggerDownload({
			fileContents: generateCSV(results),
			filename: `${brand}-materials.csv`,
			contentType: 'text/csv'
		});

		isScrapeInProgress = false;
		hasSubmittedForm = true;
	}

	function resetForm(event: Event): void {
		const form = event.target as HTMLFormElement;
		form.closest('form')?.reset();
		results = [];
		hasSubmittedForm = false;
	}

	const supportedBrandsRadioButtons = [
		{
			value: SupportedBrands.BILLABONG,
			name: 'brand',
			label: 'Billabong',
			checked: true,
			disabled: isScrapeInProgress
		},
		{
			value: SupportedBrands.RVCA,
			name: 'brand',
			label: 'RVCA',
			disabled: isScrapeInProgress
		}
	];
</script>

<div class="mb-1"></div>
<main class="flex flex-col items-center justify-center">
	<Header />
	<form class="~w-[20rem]/[37rem]" on:submit={handleSubmit}>
		<label class="label mb-2">
			<p class="text-lg font-semibold">Models:</p>
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
			{#each supportedBrandsRadioButtons as radioButtonProps}
				<RadioButton {...radioButtonProps} />
			{/each}
		</div>

		<div class="mt-4 flex items-center justify-between">
			<div class="invisible">reset 🔁</div>

			<div class="flex items-center gap-2">
				<button type="submit" disabled={isScrapeInProgress} class="variant-filled-primary btn">
					Submit
				</button>
				{#if isScrapeInProgress}
					<ProgressRadial width={'w-10'} stroke={60} />
				{/if}
			</div>

			{#if hasSubmittedForm && results.length}
				<button
					on:click={resetForm}
					type="reset"
					in:fade={{ delay: 500 }}
					class="font-medium!"
					disabled={isScrapeInProgress}
				>
					Reset 🔁
				</button>
			{:else}
				<div class="invisible">reset 🔁</div>
			{/if}
		</div>
	</form>

	<ResultsList {results} />
</main>
