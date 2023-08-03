import data from './data.json';

export interface Class {
	day: number;
	start: number;
	duration: number;
	teacher?: string;
	section: number;
}

export interface Section {
	id: number;
	max: number;
	classes: Class[];
	course: string;
}

export interface Course {
	id: string;
	name: string;
	level: number | null;
	credits: number;
	sections: Section[];
}

function getCoursesICouldTake(input: any) {
	let courses = new Map<string, Course>();

	let rawCourses = input.content;

	for (let i = 0; i < rawCourses.length; i++) {
		let raw_course = rawCourses[i];
		let course_code = raw_course.codeCourse;
		courses.set(course_code, {
			id: course_code,
			name: raw_course.course,
			level: raw_course.semester === '-' ? null : parseInt(raw_course.semester),
			credits: raw_course.credits,
			sections: []
		});
	}

	return [...courses.values()];
}

export function getCoursesICanTake(input: any) {
	let coursesICouldTake = getCoursesICouldTake(input);

	let coursesICanTake: Course[] = [];

	for (let i = 0; i < coursesICouldTake.length; i++) {
		let courseICouldTake = coursesICouldTake[i];

		let raw_classes = data.content.filter(
			(course: any) => course.codeCourse === courseICouldTake.id
		);

		if (raw_classes.length === 0) {
			continue;
		}

		for (let j = 0; j < raw_classes.length; j++) {
			let raw_class = raw_classes[j];
			let [start, end] = raw_class.dateRegister
				.split(' - ')
				.map((time: string) => parseInt(time.split(':')[0]));

			if (courseICouldTake.sections.some((section) => section.id === raw_class.sesionGroup)) {
				let section = courseICouldTake.sections.find(
					(section) => section.id === raw_class.sesionGroup
				);

				if (section) {
					section.classes.push({
						day: raw_class.day,
						teacher: raw_class?.teacher || undefined,
						start,
						duration: end - start,
						section: raw_class.sesionGroup
					});
				}
			} else {
				courseICouldTake.sections.push({
					id: raw_class.sesionGroup,
					max: raw_class.vacant,
					classes: [
						{
							day: raw_class.day,
							teacher: raw_class?.teacher || undefined,
							start,
							duration: end - start,
							section: raw_class.sesionGroup
						}
					],
					course: courseICouldTake.id
				});
			}
		}

		coursesICanTake.push(courseICouldTake);
	}

	return coursesICanTake;
}
