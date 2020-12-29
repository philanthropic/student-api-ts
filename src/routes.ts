import { TeacherController } from "./controllers/teacher";

const express = require("express");
const router = new express.Router({
    strict: true,
    caseSensitive: true,
});

// Routes related to Teacher
router.get("/teachers/view/:teacherId(\\d+)", (req, res) => {
    new TeacherController().teacherDetails(req, res);
});

module.exports = router;
