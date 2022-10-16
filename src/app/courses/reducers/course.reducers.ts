import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { CourseActions } from "../action-types";
import { compareCourses, Course } from "../model/course";


// In order to make it simple to access data use this key-value pairs format
export interface CourseState extends EntityState<Course> {
  // entities: {[key: number]:Course}, ==> (entitie format), instead we use ngrx to generate this format from an array of data
  // ids: number[]
  allCoursesLoaded: boolean;
}

// used to handle the entities created by ngrx-ntities to store data state
export const adapter = createEntityAdapter<Course>({
  // func for sorting entities
  sortComparer: compareCourses,
  // (selectId:) used if the id of the entity is custom =/= "id"
  // ex=> selectId: course => course.courseId
});

export const initialState = adapter.getInitialState({
  allCoursesLoaded: false
});

export const coursesReducer = createReducer(

  initialState,

  on(CourseActions.allCoursesLoaded,
    (state, action) => adapter.setAll(
      action.courses,
      { ...state, allCoursesLoaded: true })
  ),

  on(CourseActions.courseUpdated,
    (state, action) => adapter.updateOne(action.update, state)
    ),

);



export const {
  selectAll
} = adapter.getSelectors();


