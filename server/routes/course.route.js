import express from 'express';
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utils/multer.js"
import { createCourse, createLecture, editCourse, editLecture, getCourseById, getCourseLectures, getCreateCourse, getLectureById, getPublishedCourses, removeLecture, searchCourses, togglePublishCourse } from "../controllers/course.controller.js";

const router=express.Router();

router.route("/").post(isAuthenticated, createCourse);
router.route("/search").get(isAuthenticated, searchCourses);
router.route("/published-courses").get(isAuthenticated, getPublishedCourses);
router.route("/").get(isAuthenticated, getCreateCourse);
router.route("/:courseId").put(
    isAuthenticated,
    upload.single("courseThumbnail"),
    editCourse
  );

  router.get('/:courseId', isAuthenticated, getCourseById);

router.route("/:courseId/lecture").post(isAuthenticated, createLecture);
router.route("/:courseId/lecture").get(isAuthenticated, getCourseLectures);
router.route("/:courseId/lecture/:lectureId").post(isAuthenticated, editLecture);  
router.route("/lecture/:lectureId").delete(isAuthenticated, removeLecture);
router.route("/lecture/:lectureId").get(isAuthenticated, getLectureById);
router.route("/:courseId").patch(isAuthenticated, togglePublishCourse);



export default router;