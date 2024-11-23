<script lang="ts">
	import { NOT_FOUND_TEXT } from '$lib/constants/not-found-text.constant';
	import type { ScrapedResult } from '$lib/types/scraped-result.type';
	import { popup } from '@skeletonlabs/skeleton';

	export let results: Array<ScrapedResult> = [];
</script>

{#if results.length > 0}
	<div class="mt-4 w-1/3">
		<div class="flex justify-between">
			<h2 class="text-lg font-semibold">Results:</h2>
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
