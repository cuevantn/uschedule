<script lang="ts">
	import type { Course } from '$lib';
	import all_colors from 'tailwindcss/colors';
	import ShortClass from './ShortClass.svelte';
	import LongClass from './LongClass.svelte';
	export let courses: Course[];
	export let min: number;
	export let max: number;

	let days: {
		id: number;
		name: string;
	}[] = [
		{ id: 1, name: 'Monday' },
		{ id: 2, name: 'Tuesday' },
		{ id: 3, name: 'Wednesday' },
		{ id: 4, name: 'Thursday' },
		{ id: 5, name: 'Friday' },
		{ id: 6, name: 'Saturday' }
	];

	let credits = courses[0].credits + courses[1].credits;

	let hours = Array.from({ length: max - min }, (_, i) => i + min);

	let visibleSections = [courses[0].sections[0], courses[1].sections[0]];

	interface x {
		value: string;
		sort: number;
	}

	let colors = Object.values(all_colors)
		.filter((color) => typeof color === 'object')
		.reduce((acc, color) => [...acc, color[400], color[600], color[800]], [])
		.map((value: string) => ({ value, sort: Math.random() }))
		.sort((a: x, b: x) => a.sort - b.sort)
		.map(({ value }: x) => value);

	$: console.log(colors);

	function shuffleColors() {
		colors = colors
			.map((value: string) => ({ value, sort: Math.random() }))
			.sort((a: x, b: x) => a.sort - b.sort)
			.map(({ value }: x) => value);
	}

	function handleToggleSection(section_id: number, course_id: string) {
		console.log(section_id, course_id);
		let index = visibleSections.findIndex(
			(section) => section.course === course_id && section.id === section_id
		);
		if (index === -1) {
			let course = courses.find((course) => course.id === course_id);
			if (course) {
				let section = course.sections.find((section) => section.id === section_id);
				if (section) {
					visibleSections.push(section);
					credits += course.credits;
				}
			}
		} else {
			visibleSections.splice(index, 1);
			credits -= courses.find((course) => course.id === course_id)?.credits || 0;
		}

		visibleSections = [...visibleSections];
	}

	function checkIsVisible(section_id: number, course_id: string) {
		return visibleSections.some(
			(section) => section.course === course_id && section.id === section_id
		);
	}

	function getSectionColor(section_id: number, course_id: string) {
		let index = visibleSections.findIndex(
			(section) => section.course === course_id && section.id === section_id
		);
		return colors[index];
	}

	function getStyle(section_id: number, course_id: string): string {
		if (checkIsVisible(section_id, course_id)) {
			return `background-color: ${getSectionColor(section_id, course_id)}`;
		} else {
			return `background-color: transparent`;
		}
	}
</script>

<div class="flex items-start">
	<div class="w-[18rem] mr-4 flex-none">
		<div class="font-bold w-full h-12 flex items-center pl-4">
			<div>Cursos</div>
			<div class="ml-auto">{credits} créditos</div>
		</div>
		<ul class="border h-[48rem] overflow-auto">
			{#each courses as course}
				<li class="p-4 border-b last:border-b-0">
					<p class="font-bold">{course.name}</p>
					<div class="flex mb-2 space-x-2">
						<p class="pr-2 border-r">{course.id}</p>
						<p class="pr-2 border-r">{course.credits} créditos</p>
						<p class="">{course.level ? `nivel ${course.level}` : 'electivo'}</p>
					</div>
					<p class="text-sm">Secciones:</p>
					<div class="flex gap-2 flex-shrink">
						{#each course.sections as section}
							{#key [visibleSections, colors]}
								<button
									on:click={() => handleToggleSection(section.id, course.id)}
									class="border w-8 h-8"
									style={getStyle(section.id, course.id)}
								>
									{section.id}
								</button>
							{/key}
						{/each}
					</div>
				</li>
			{/each}
		</ul>
		<button on:click={shuffleColors}>New colors</button>
	</div>

	<div class="grid grid-cols-7 grow">
		<div class="relative group">
			<div class="font-bold w-full h-12 flex items-center justify-center">Hours</div>
			<div
				class="grid h-[48rem]"
				style={`grid-template-rows: repeat(${max - min}, minmax(0, 1fr));`}
			>
				{#each hours as hour}
					<div class="relative">
						<div class="h-full flex items-center">
							<p class="w-full text-center">{hour}:00 - {hour + 1}:00</p>
						</div>
						<div class="w-[700%] h-[1px] absolute top-0 bg-gray-200" />
					</div>
				{/each}
			</div>

			<div class="w-full h-[1px] absolute top-0 bg-gray-200" />
			<div class="w-full h-[1px] absolute bottom-0 bg-gray-200" />
			<div class="top-0 bottom-0 w-[1px] absolute right-0 bg-gray-200" />
			<div class="top-0 bottom-0 group-first:w-[1px] absolute left-0 bg-gray-200" />
		</div>
		{#each days as day}
			<div class="relative group">
				<div class="font-bold w-full h-12 flex items-center justify-center">
					{day.name}
				</div>
				<div
					class="grid h-[48rem]"
					style={`grid-template-rows: repeat(${max - min}, minmax(0, 1fr));`}
				>
					{#key colors}
						{#each visibleSections as section}
							{#each section.classes.filter((_class) => _class.day === day.id) as _class}
								{@const course = courses.find((course) => course.id === section.course)}
								{@const color = getSectionColor(section.id, course?.id || '')}

								{#if _class.duration > 1}
									<LongClass
										name={course?.name || ''}
										course_id={course?.id || ''}
										section={section.id}
										start={_class.start - min + 1}
										{color}
										duration={_class.duration}
										teacher={_class.teacher}
									/>
								{:else}
									<ShortClass name={course?.name || ''} start={_class.start - min + 1} {color} />
								{/if}
							{/each}
						{/each}
					{/key}
				</div>

				<div class="w-full h-[1px] absolute top-0 bg-gray-200" />
				<div class="w-full h-[1px] absolute bottom-0 bg-gray-200" />
				<div class="top-0 bottom-0 w-[1px] absolute right-0 bg-gray-200" />
				<div class="top-0 bottom-0 group-first:w-[1px] absolute left-0 bg-gray-200" />
			</div>
		{/each}
	</div>
</div>
