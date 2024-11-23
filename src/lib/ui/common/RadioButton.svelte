<script lang="ts">
	export let value: any;
	export let name: string;
	export let label: string;
	export let checked: boolean = false;
	export let disabled: boolean = false;
</script>

<label class="flex items-center space-x-2 font-medium">
	<input class="radio" type="radio" {name} {value} {disabled} {checked} />
	<p>{label}</p>
</label>
