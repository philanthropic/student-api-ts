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

router.post("/teachers/", (req: any, res: any) => {
    new TeacherController().addNewTeacher(req, res);
});

router.patch("/teachers/edit/:teacherId(\\d+)", (req: any, res: any) => {
    new TeacherController().updateTeacher(req, res);
});

router.delete("/teachers/delete/:teacherId(\\d+)", (req: any, res: any) => {
    new TeacherController().deleteTeacher(req, res);
});



// Routes related to Student
router.get("/students/view/:studentId(\\d+)", (req, res) => {
    new StudentController().studentDetails(req, res);
});

// if search query is passed then student will run search query.
router.get("/students/", (req: any, res: any) => {
    new StudentController().studentList(req, res);
});

router.post("/students/", (req, res)=> {
    new StudentController().addNewStudent(req, res);
})

router.patch("/students/edit/:studentId(\\d+)", (req: any, res: any) => {
    new StudentController().updateStudent(req, res);
});

router.delete("/students/delete/:studentId(\\d+)", (req: any, res: any) => {
    new StudentController().deleteStudent(req, res);
});


// Routes related to Subject
router.get("/subjects/view/:subjectId(\\d+)", (req, res) => {
    new SubjectController().subjectDetails(req, res);
});

router.post("/subjects/", (req: any, res: any) => {
    new SubjectController().addNewSubject(req, res);
});

module.exports = router;
