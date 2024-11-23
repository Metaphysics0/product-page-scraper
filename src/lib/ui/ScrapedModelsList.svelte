<script lang="ts">
	import type { ScrapedResult } from '$lib/types/scraped-result.type';

	export let results: Array<ScrapedResult> = [];
</script>

{#if results.length > 0}
	<div class="mt-4 w-1/3 space-y-2">
		<h2 class="text-lg font-semibold">Results:</h2>
		{#each results as { model, success }}
			<div class="flex items-center gap-2 rounded bg-surface-200 p-2">
				<span class="flex-1">{model}</span>
				{#if success}
					<span class="text-success-500">✓</span>
				{:else}
					<span class="text-error-500">✗</span>
				{/if}
			</div>
		{/each}
	</div>
{/if}
