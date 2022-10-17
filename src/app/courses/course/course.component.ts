import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {Observable, of, pipe} from 'rxjs';
import {Lesson} from '../model/lesson';
import {concatMap, delay, filter, first, map, shareReplay, tap, withLatestFrom} from 'rxjs/operators';
import {CoursesHttpService} from '../services/courses-http.service';
import { CourseEntityService } from '../services/course-entity.service';
import { LessonEntityService } from '../services/lesson-entity.service';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  course$: Observable<Course>;

  loading$: Observable<boolean>;

  lessons$: Observable<Lesson[]>;

  displayedColumns = ['seqNo', 'description', 'duration'];

  nextPage = 0;

  constructor(
    private coursesService: CourseEntityService,
    private lessonsService: LessonEntityService,
    private route: ActivatedRoute) {

  }

  ngOnInit() {

    const courseUrl = this.route.snapshot.paramMap.get("courseUrl");

    this.course$ = this.coursesService.entities$
      .pipe(
        map(courses => courses.find(course => course.url == courseUrl))
      );

    this.lessons$ = this.lessonsService.entities$
      pipe(
        withLatestFrom(this.course$),
        tap(([lessons, course]) => {
          console.log('Inside Tap');
          if (this.nextPage == 0) {
            this.loadLessonsPage(course);
            console.log('loading lessons page: ' + this.nextPage)
          } else {
            console.log('loading lessons failed')
          }
          }),
        map(([lessons, course]) =>
            (lessons as Lesson[]).filter(lesson => lesson.courseId == course.id))
      );
    // // Old implementation
    // this.lessons$ = this.course$.pipe(
    //   concatMap(course => this.coursesService.findLessons(course.id)),
    //   tap(console.log)
    // );

    this.loading$ = this.lessonsService.loading$.pipe(delay(0));

  }


  loadLessonsPage(course: Course) {
    this.lessonsService.getWithQuery({
      'courseId': course.id.toLocaleString(),
      'pageNumber': this.nextPage.toLocaleString(),
      'pageSize': '3'
    });

    this.nextPage++;
  }

}
