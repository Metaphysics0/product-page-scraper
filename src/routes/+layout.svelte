<script lang="ts">
	import '../app.postcss';
	import '../app.css';
	let { children } = $props();

	import { initializeStores, Toast, storePopup } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';

	initializeStores();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
</script>

<Toast />

{@render children()}
