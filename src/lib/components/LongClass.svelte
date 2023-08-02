<script lang="ts">
	export let name: string;
	export let course_id: string;
	export let section: number;
	export let start: number;
	export let color: string;
	export let duration: number;
	export let teacher: string | undefined;
</script>

<div
	class="relative w-full text-white text-center border-b"
	style={`grid-row-start: ${start}; grid-row-end: ${start + duration}; background-color: ${color};`}
>
	<div class="h-full w-full p-1">
		<p class="text-center text-xs font-bold mb-1.5">{name}</p>
		<p class="text-center text-xs">{teacher}</p>

		<p class="text-xs absolute bottom-1 right-1">
			Sec. {section}
		</p>
		<p class="text-xs absolute bottom-1 left-1">
			{course_id}
		</p>
	</div>
</div>
