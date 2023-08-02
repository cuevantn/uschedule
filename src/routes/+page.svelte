<script lang="ts">
	import { getCoursesICanTake, type Course } from '$lib';
	import Schedule from '$lib/components/Schedule.svelte';
	import { default_text } from '$lib/default-text';
	let text = default_text;
	let courses: Course[] | undefined = undefined;
	let min: number, max: number;

	function handleSubmit() {
		let result = getCoursesICanTake(JSON.parse(text));
		courses = result;
	}

	// min start time
	$: {
		if (courses) {
			min = courses.reduce((acc, course) => {
				course.sections.forEach((section) => {
					section.classes.forEach((_class) => {
						if (_class.start < acc) {
							acc = _class.start;
						}
					});
				});
				return acc;
			}, 24);

			max = courses.reduce((acc, course) => {
				course.sections.forEach((section) => {
					section.classes.forEach((_class) => {
						if (_class.start + _class.duration > acc) {
							acc = _class.start + _class.duration;
						}
					});
				});
				return acc;
			}, 7);
		}
	}
</script>

<div class="container mx-auto my-16">
	<h1 class="text-center text-3xl mb-4 font-black">USchedule</h1>

	{#if courses}
		<Schedule {courses} {min} {max} />
		<button
			on:click={() => {
				courses = undefined;
			}}
			class="border border-green-500 text-green-500 w-full h-12 mt-4"
			type="submit">Atrás</button
		>
	{:else}
		<p class="font-thin text-center">¿Quieres VISUALIZAR tus posibles horarios de la UTEC?</p>
		<p class="font-thin text-center">Ve a Sistema Académico -> Consultas -> Mi carga hábil</p>
		<p class="font-thin text-center">Cosas, cosas, cosas...</p>
		<p class="font-thin text-center mb-4">Pega la data aquí abajo:</p>
		<p class="font-thin text-center mb-4">
			Estoy trabajando en un video tutorial. Por mientras puedes ver mis horrib... digo posibles
			horarios
		</p>

		<form
			on:submit|preventDefault={handleSubmit}
			class="flex flex-col items-center max-w-lg mx-auto space-y-2 mb-8"
		>
			<textarea rows="10" bind:value={text} class="w-full" />
			<button class="bg-green-500 w-full h-12" type="submit">Continuar</button>
		</form>
	{/if}
</div>
