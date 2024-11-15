<script lang="ts">
	import { enhance } from '$app/forms';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let isScrapeInProgress = false;
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();
</script>

<div class="mb-4"></div>
<main class="flex flex-col items-center justify-center">
	<section class="mb-3 text-center">
		<h1 class="h1 mb-2">Netta's Automation 🚀</h1>
		<p>Paste a list of models, and we will scrape the product pages for the materials</p>
	</section>

	<form
		class="w-1/3"
		method="POST"
		use:enhance={({ formElement }) => {
			isScrapeInProgress = true;
			return async ({ result }) => {
				toastStore.trigger({
					message: 'Check your email!'
				});
				formElement.reset();
				isScrapeInProgress = false;
			};
		}}
	>
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

		<label class="label mb-4">
			<span>Email:</span>
			<input name="emailTo" class="input p-2" type="email" placeholder="ryan@mail.com" />
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

	{#if form?.success}
		<p class="mt-4 text-error-500">{form.message}</p>
	{/if}
</main>
