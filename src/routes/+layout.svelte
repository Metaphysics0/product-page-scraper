<script lang="ts">
	import '../app.postcss';
	import '../app.css';
	let { children } = $props();

	import { initializeStores, Toast } from '@skeletonlabs/skeleton';

	initializeStores();
</script>

<Toast />

{@render children()}
