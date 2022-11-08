
const express = require('express');
const router = express.Router();

const studentController=require("../studentMgmt/controller/studentCon")

router.post("/register", studentController.createStudent)
router.put("/students/:studentId", studentController.updateStudent)
router.get("/students/", studentController.getStudents)

//router.delete("/students/:studentId", studentController.deleteStudentbyId)
//router.delete("/students/", studentController.delete)

module.exports=router