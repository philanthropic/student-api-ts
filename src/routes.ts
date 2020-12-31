import { StudentController } from "./controllers/student";
import { TeacherController } from "./controllers/teacher";
import { SubjectController } from "./controllers/subject";

const express = require("express");
const router = new express.Router({
    strict: true,
    caseSensitive: true,
});

// Routes related to Teacher
router.get("/teachers/view/:teacherId(\\d+)", (req, res) => {
    new TeacherController().teacherDetails(req, res);
});

// Routes related to Student
router.get("/students/view/:studentId(\\d+)", (req, res) => {
    new StudentController().studentDetails(req, res);
});

// Routes related to Subject
router.get("/subjects/view/:subjectId(\\d+)", (req, res) => {
    new SubjectController().subjectDetails(req, res);
});
module.exports = router;
