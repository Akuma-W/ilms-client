import { gradeCategoriesService } from './grade-categories.service';
import { gradebookService } from './gradebook.service';
import { gradeCalculationsService } from './grade-calculations.service';

export const gradesService = {
  ...gradebookService,
  ...gradeCalculationsService,
  ...gradeCategoriesService,
};

export { gradebookService, gradeCalculationsService, gradeCategoriesService };
