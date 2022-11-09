
const express = require('express');
const router = express.Router();

const studentController=require("../studentMgmt/controller/studentCon")

router.post("/create", studentController.createStudent)
router.put("/students/:studentId", studentController.updateStudent)
router.get("/getstudents/", studentController.getStudents)

//router.delete("/students/", studentController.delete)

module.exports=router