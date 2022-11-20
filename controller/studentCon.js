const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const studentModel = require("../Models/studentMod");
const logStudMod = require("../Models/loginMod");

let nameRegex = /^[a-zA-Z ]+$/;

let ageRegex = /^[1-9]?[0-9]{1}$|^100$/;

let mobileRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;

let emailRegex =
  /^[a-z]{1}[a-z0-9._]{1,100}[@]{1}[a-z]{2,15}[.]{1}[a-z]{2,10}$/;

function removeSpaces(x) {
  return x
    .split(" ")
    .filter((y) => y)
    .join(" ");
}

const isValid = function (value) {
  if (typeof value == "string" && value.trim().length == 0) {
    // console.log("2")
    return false;
  }

  return true;
};

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

module.exports.createStudent = async function (req, res) {
  try {
    let data = req.body;
    const { Name, Age, Mobile, Email, isDeleted } = data;

    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "Body should not be Empty.. " });
    }

    if (!Name || typeof Name == "undefined" || Name == " ") {
      return res
        .status(400)
        .send({ status: false, message: "Please enter the Name" });
    }
    if (!nameRegex.test(Name)) {
      return res
        .status(400)
        .send({ Status: false, message: "Please enter a valid Name ⚠️⚠️" });
    }

    if (!Age || typeof Age == "undefined" || Age == " ") {
      return res
        .status(400)
        .send({ status: false, message: "Please enter the Age" });
    }

    if (!ageRegex.test(Age)) {
      return res
        .status(400)
        .send({ Status: false, message: "Please enter a valid age ⚠️⚠️" });
    }

    if (!Mobile || typeof Mobile == "undefined" || Mobile == " ") {
      return res
        .status(400)
        .send({ status: false, message: "Please enter the Mobile" });
    }

    if (!mobileRegex.test(Mobile)) {
      return res
        .status(400)
        .send({
          Status: false,
          message: "Please enter valid Indian mobile number ⚠️⚠️",
        });
    }
    if (Mobile) {
      let checkmobile = await studentModel.findOne({ Mobile: Mobile });

      if (checkmobile) {
        return res
          .status(400)
          .send({
            Status: false,
            message:
              "Please provide another number, this number has been used ⚠️⚠️",
          });
      }
    }

    if (!Email || typeof Email == "undefined" || Email == " ") {
      return res
        .status(400)
        .send({ status: false, message: "Please enter the Email" });
    }

    if (!emailRegex.test(Email)) {
      return res
        .status(400)
        .send({ Status: false, message: "Please enter valid email ⚠️⚠️" });
    }

    if (Email) {
      let checkemail = await studentModel.findOne({ Email: Email });

      if (checkemail) {
        return res
          .status(400)
          .send({
            Status: false,
            message:
              "Please provide another email, this email has been used ⚠️⚠️",
          });
      }
    }
    let notShowed = {
      createdAt: 0,
      updatedAt: 0,
      isDeleted: 0,
      deletedAt: 0,
      __v: 0,
    };

    let Student = await studentModel.create(data);
    let savedData = await studentModel.findOne(Student).select(notShowed);
    let date = new Date();
    res
      .status(200)
      .send({
        status: true,
        msg: "Student Added Successfully ✅✅",
        CreatedAt: date.toLocaleString(),
        data: savedData,
      });
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

let validatePassword = (password) => {
  var pass = /^(?=.*?[A-Za-z0-9#?!@$%^&*-]).{8,15}$/;
  return pass.test(password);
};

module.exports.loginStudent = async function (req, res) {
  try {
    let data = req.body;
    let { userName, password } = data;

    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "Body should not be Empty.. " });
    }
    if (!userName) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter the user name." });
    }
    if (!isValid(userName)) {
      return res
        .status(400)
        .send({ status: false, msg: "Enter valid userName." });
    }
    if (!nameRegex.test(userName)) {
      {
        return res
          .status(400)
          .send({ status: false, msg: "Enter valid userName." });
      }
    }

    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: " please enter the password" });
    }

    if (password) {
      if (!validatePassword(password)) {
        return res
          .status(400)
          .send({ status: false, msg: "enter valid password" });
      }
    }

    let student = await logStudMod.findOne({
      userName: userName,
      password: password,
    });
    if (!student)
      return res.status(400).send({
        status: false,
        msg: "username or password is not correct",
      });

    let token = jwt.sign(
      {
        studentId: student._id.toString(),
        organisation: "InfoDrive Solutions",
      },
      "AnjaliAyushAdityaAmit"
    );
    res.setHeader("x-api-key", token);
    let date = new Date();
    res
      .status(200)
      .send({
        status: true,
        msg: "login successfull",
        lastLogin: date.toLocaleString(),
      });
  } catch (err) {
    res.status(500).send({ msg: "Error", error: err.message });
  }
};

module.exports.getStudents = async function (req, res) {
  try {
    let q = req.query;
    q.isDeleted = false;

    let notShowed = {
      createdAt: 0,
      updatedAt: 0,
      isDeleted: 0,
      deletedAt: 0,
      __v: 0,
    };

    const data = await studentModel.find(q).select(notShowed);
    // console.log(data)
    if (data.length == 0)
      return res
        .status(404)
        .send({ status: false, msg: "No student record found" });

    let date = new Date();
    res
      .status(200)
      .send({ status: true, lastSeen: date.toLocaleString(), data: data });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.updateStudent = async function (req, res) {
  try {
    let data = req.body;
    let { Name, Age, Mobile, Email } = data;
    let studentId = req.params.studentId;

    if (!isValidObjectId(studentId)) {
      return res
        .status(400)
        .send({ status: false, message: "StudentId is in invalid format." });
    }

    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "Body should not be Empty.. " });
    }

    let student = await studentModel.findOne({
      _id: studentId,
      isDeleted: false,
    });

    if (!student) {
      return res
        .status(404)
        .send({ status: false, msg: "No such student exists" });
    }

    let temp = {};

    if (Name || Name == "") {
      student.Name = Name;
      if (!nameRegex.test(Name))
        return res.status(404).send({ status: false, msg: "Enter valid Name" });
      temp["Name"] = Name;
    }

    if (Age || Age == "") {
      student.Age = Age;
      if (!ageRegex.test(Age))
        return res
          .status(400)
          .send({ status: false, message: "Enter the valid Age" });
      temp["Age"] = Age;
    }

    if (Mobile || Mobile == "") {
      student.Mobile = Mobile;
      if (!mobileRegex.test(Mobile))
        return res
          .status(400)
          .send({ status: false, message: "Enter the valid Mobile" });
      temp["Mobile"] = Mobile;

      let checkmobile = await studentModel.findOne({ Mobile: Mobile });

      if (checkmobile) {
        return res
          .status(400)
          .send({
            Status: false,
            message:
              "Please provide another number, this number has been used ⚠️⚠️",
          });
      }
    }

    if (Email || Email == "") {
      student.Email = Email;
      if (!emailRegex.test(Email))
        return res
          .status(400)
          .send({ status: false, message: "Enter the valid Email" });
      let checkemail = await studentModel.findOne({ Email: Email });

      if (checkemail) {
        return res
          .status(400)
          .send({
            Status: false,
            message:
              "Please provide another email, this email has been used ⚠️⚠️",
          });
      }
      temp["Email"] = Email;
    }

    let notShowed = {
      createdAt: 0,
      updatedAt: 0,
      isDeleted: 0,
      deletedAt: 0,
      __v: 0,
    };

    let date = new Date();
    let update = await studentModel
      .findOneAndUpdate({ _id: studentId }, { $set: temp }, { new: true })
      .select(notShowed);
    res
      .status(200)
      .send({
        status: true,
        msg: "Student details updated successfully",
        UpdatedAt: date.toLocaleString(),
        data: update,
      });
  } catch (err) {
    res.status(500).send({ status: false, msg: "Error", error: err.message });
  }
};

module.exports.deleteStudent = async function (req, res) {
  try {
    let delQueryData = req.query;

    const { Mobile } = delQueryData;

    if (Object.keys(delQueryData) == 0) {
      return res
        .status(400)
        .send({
          status: false,
          message:
            "please provide the mobile number of the student which you want to delete",
        });
    }
    let date = new Date();

    const findStudent = await studentModel
      .findOneAndUpdate(
        { delQueryData, isDeleted: false },
        { $set: { isDeleted: true }, deletedAt: date },
        { new: true }
      )
      .select({ deletedAt: 0 });

    if (!findStudent)
      return res
        .status(404)
        .send({ status: false, message: "No Student found" });

    return res
      .status(200)
      .send({
        status: true,
        DeletedAt: date.toLocaleString(),
        message: "student successfully deleted",
      });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports.loginDatabase = async function (req, res) {
  try {
    let data = req.body;
    const { userName, password } = data;

    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "Body should not be Empty.. " });
    }
    if (!userName) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter the user name." });
    }
    if (!isValid(userName)) {
      return res
        .status(400)
        .send({ status: false, msg: "Enter valid userName." });
    }
    if (!nameRegex.test(userName)) {
      return res
        .status(400)
        .send({ status: false, msg: "Enter valid userName." });
    }

    if (!isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "enter the password" });
    }

    if (password) {
      if (!validatePassword(password)) {
        return res
          .status(400)
          .send({ status: false, msg: "enter valid password" });
      }
    } else {
      {
        return res
          .status(400)
          .send({ status: false, message: "enter the password" });
      }
    }

    let findUser = await logStudMod.findOne({ userName });
    if (findUser)
      return res
        .status(404)
        .send({
          status: false,
          msg: "this userName has already been used...please provide another userName",
        });

    await logStudMod.create(data);
    // let savedData = await logStudMod.findOne(Student).select({__v:0})
    res.status(200).send({ status: true });
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};
