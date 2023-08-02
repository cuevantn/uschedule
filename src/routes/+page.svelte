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

<svelte:head>
	<title>USchedule - Visualiza tu horario UTEC</title>
</svelte:head>

<div class="relative container mx-auto py-16 min-h-screen">
	<h1 class="text-center text-5xl mb-4 font-black">USchedule</h1>

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
		<div class="max-w-lg mx-auto">
			<p class="text-center">Visualiza tu horario UTEC 👀</p>
			<p class="font-light text-center">
				¿Cansado de hacer excels para tu horario? ¡Prueba USchedule YA! Una opción gráfica para
				visualizar tu <span class="italic">carga hábil</span>
			</p>
			<iframe
				src="https://www.youtube.com/embed/DrUmQdL7z84"
				title="USchedule D-E-M-O"
				frameborder="0"
				class="w-full aspect-video my-4"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowfullscreen
			/>

			<form
				on:submit|preventDefault={handleSubmit}
				class="flex flex-col items-center max-w-lg mx-auto space-y-2 mb-8"
			>
				<label for="text" class="text-center">Ctrl + v aquí 👇</label>
				<textarea id="text" rows="10" bind:value={text} class="w-full" />
				<button class="bg-green-500 w-full h-12" type="submit">Continuar</button>
			</form>
		</div>
	{/if}

	<a
		class="text-gray-600 absolute bottom-8 left-1/2 transform -translate-x-1/2"
		href="https://github.com/cuevantn/uschedule">Check the source code on Github :)</a
	>
</div>
