<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<div class="mb-4"></div>
<main class="flex flex-col items-center justify-center">
	<section class="mb-3 text-center">
		<h1 class="h1 mb-2">Netta's Automation 🚀</h1>
		<p>Paste a list of models, and we will scrape the product pages for the materials</p>
	</section>

	<form class="w-1/3" method="POST" use:enhance>
		<label class="label mb-2">
			<textarea required name="models" class="textarea p-2" rows="10" placeholder="Models"
			></textarea>
		</label>

		<div class="mx-auto w-fit">
			<label class="flex items-center space-x-2">
				<input class="radio" type="radio" checked name="brand" value="billabong" />
				<p>Billabong</p>
			</label>
			<label class="flex items-center space-x-2">
				<input class="radio" type="radio" name="brand" value="rvca" />
				<p>RVCA</p>
			</label>
		</div>

		<div class="mt-4 text-center">
			<button type="submit" class="btn variant-filled-primary"> Submit </button>
		</div>
	</form>

	{#if form?.error}
		<p class="text-error-500 mt-4">{form.error}</p>
	{/if}
</main>
