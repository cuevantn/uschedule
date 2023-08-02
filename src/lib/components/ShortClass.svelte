<script lang="ts">
	export let name: string;
	export let start: number;
	export let color: string;
</script>

<div
	class="relative border-b"
	style="grid-row: span 1 / span 1; grid-row-start: {start}; background-color: {color};"
>
	<div class="flex h-full items-center">
		<p class="text-white text-xs font-bold w-full text-center">{name}</p>
	</div>
</div>
