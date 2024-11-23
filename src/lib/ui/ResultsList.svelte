<script lang="ts">
	import { NOT_FOUND_TEXT } from '$lib/constants/not-found-text.constant';
	import type { ScrapedResult } from '$lib/types/scraped-result.type';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';

	// export let results: Array<ScrapedResult> = [];
	// console.log('RESULTS', results);

	const results = [
		{
			model: 'AVBKT00162',
			success: true,
			materials: 'Materials [Main Fabric] 60% Cotton, 40% Polyester'
		},
		{
			model: 'AVBNP00106',
			success: true,
			materials: 'Materials 68% Cotton, 30% Polyester, 2% Elastane'
		},
		{
			model: 'AVBWS00130',
			success: true,
			materials: 'Materials 68% Cotton, 30% Polyester, 2% Elastane'
		},
		{
			model: 'AVBWT00168',
			success: true,
			materials: 'NOT FOUND'
		},
		{
			model: 'AVBWT00170',
			success: true,
			materials: 'Materials 53% Cotton, 44% Polyester, 3% Elastane'
		},
		{
			model: 'AVBWT00171',
			success: true,
			materials: 'Materials 53% Cotton, 44% Polyester, 3% Elastane'
		},
		{
			model: 'AVBWT00172',
			success: true,
			materials: 'Features'
		},
		{
			model: 'AVBWT00173',
			success: true,
			materials: 'Materials 60% Cotton, 40% Polyester'
		}
	];

	const numberOfSuccessfulResults =
		results?.filter((r) => r?.success && r.materials !== NOT_FOUND_TEXT)?.length || 0;
</script>

{#if results.length > 0}
	<div class="mt-4 w-1/3">
		<div class="flex justify-between">
			<h2 class="text-lg font-semibold">Results:</h2>
			<span class="font-light italic">
				{numberOfSuccessfulResults} out of {results.length} succeeded
			</span>
		</div>

		<!-- Scrollable container -->
		<div class="mt-2 rounded-container-token">
			<div class="max-h-[60vh] space-y-2 overflow-y-auto p-4">
				{#each results as { model, success, materials }}
					<div
						class="flex items-center gap-2 rounded border border-surface-300 bg-surface-200 p-2 font-medium hover:shadow-md"
						use:popup={{ event: 'hover', target: `popup-${model}`, placement: 'right' }}
					>
						<span class="flex-1">{model}</span>
						{#if materials === NOT_FOUND_TEXT}
							<span class="text-error-500">⚠️</span>
						{:else if !success}
							<span class="text-error-500">✗</span>
						{:else}
							<span class="text-success-500">✓</span>
						{/if}
					</div>
					<div class="card p-4 shadow-sm" data-popup={`popup-${model}`}>
						<p>{materials}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
