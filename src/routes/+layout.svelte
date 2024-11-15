<script lang="ts">
	import '../app.css';
	let { children } = $props();

	import { initializeStores, Toast } from '@skeletonlabs/skeleton';

	initializeStores();
</script>

<Toast />

{@render children()}
