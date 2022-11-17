
const express = require('express');
const router = express.Router();

const studentController=require("../studentMgmt/controller/studentCon")

router.post("/create", studentController.createStudent)

router.post("/login", studentController.loginStudent)
router.put("/students/:studentId", studentController.updateStudent)
router.get("/getstudents", studentController.getStudents)

router.delete("/delete", studentController.deleteStudent)

module.exports=router