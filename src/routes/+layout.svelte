<script lang="ts">
	import '../app.postcss';
	import '../app.css';
	let { children } = $props();

	import { initializeStores, Toast, storePopup } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import Navbar from '$lib/ui/Navbar.svelte';

	initializeStores();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
</script>

<Toast />

<Navbar />
{@render children()}
