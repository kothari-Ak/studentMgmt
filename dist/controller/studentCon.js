"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const client = require("../connection");
let nameRegex = /^[a-zA-Z ]+$/;
let ageRegex = /^[1-9]?[0-9]{1}$|^100$/;
let mobileRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;
let emailRegex = /^[a-z]{1}[a-z0-9._]{1,100}[@]{1}[a-z]{2,15}[.]{1}[a-z]{2,10}$/;
const isValid = function (value) {
    if (typeof value == "string" && value.trim().length == 0) {
        return false;
    }
    return true;
};
module.exports.createStudent = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let data = req.body;
            let { id, Name, Age, Mobile, Email } = data;
            if (Object.keys(data).length == 0) {
                return res
                    .status(400)
                    .send({ status: false, msg: "Body should not be Empty.. " });
            }
            if (!id || typeof id == "undefined" || id == " ") {
                return res
                    .status(400)
                    .send({ status: false, message: "Please enter some id" });
            }
            if (typeof id != "number") {
                return res
                    .status(400)
                    .send({ status: false, message: "Please enter valid id" });
            }
            if (id) {
                const checkId = yield client.query(`SELECT * FROM studenttable WHERE id= ($1);`.toLowerCase(), [id]);
                const arr = checkId.rows;
                if (arr.length != 0) {
                    return res.status(400).json({
                        error: "Please provide some other id...this id has been used ⚠️⚠️"
                    });
                }
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
                const checkMobile = yield client.query(`SELECT * FROM studenttable WHERE Mobile= $1`, [Mobile]); //Checking if mobile number already exists
                const arr = checkMobile.rows;
                if (arr.length != 0) {
                    return res.status(400).json({
                        error: "Please provide another number, this number has been used ⚠️⚠️"
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
                const checkEmail = yield client.query(`SELECT * FROM studenttable WHERE Email= ($1);`, [Email]); //Checking if email already exists
                const arr = checkEmail.rows;
                if (arr.length != 0) {
                    return res.status(400).json({
                        error: "Email already there, No need to register again.",
                    });
                }
            }
            let date = new Date();
            let insertQuery = "insert into studenttable(id,Name, Age, Mobile, Email) values($1,lower($2),$3,$4,$5)";
            yield client.query(insertQuery, [id, Name, Age, Mobile, Email]);
            let StudentId = id, Event = "Created", TimeStamps = date, Description = "Student has been added";
            let setFields = "insert into systemlogs(StudentId,Event,TimeStamps, Description) values($1,$2,$3,$4)";
            yield client.query(setFields, [StudentId, Event, TimeStamps, Description]);
            res
                .status(200)
                .send({
                status: true,
                msg: "Student Added Successfully ✅✅",
                data: { id, Name, Age, Mobile, Email }
            });
        }
        catch (error) {
            res.status(500).send({ status: false, error: error.message });
        }
    });
};
let validatePassword = (password) => {
    var pass = /^(?=.*?[A-Za-z0-9#?!@$%^&*-]).{8,15}$/;
    return pass.test(password);
};
module.exports.loginStudent = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
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
            let arr;
            if (userName) {
                const checkUserName = yield client.query(`SELECT * FROM logindatabase WHERE userName = lower($1) And password = lower($2);`, [userName, password]);
                arr = checkUserName.rows;
                if (arr.length == 0) {
                    return res.status(400).json({
                        error: "userName or password is not correct",
                    });
                }
            }
            let dta = Object.values(arr[0]);
            let token = jwt.sign({
                studentdata: dta.toString(),
                organisation: "InfoDrive Solutions",
            }, "AnjaliAyushAdityaAmit");
            res.setHeader("x-api-key", token);
            let date = new Date();
            res
                .status(200)
                .send({
                status: true,
                msg: "login successfull",
                lastLogin: date.toLocaleString(),
            });
        }
        catch (err) {
            res.status(500).send({ msg: "Error", error: err.message });
        }
    });
};
module.exports.getStudents = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let q = req.query;
            let { id, Name, Age, Mobile, Email } = q;
            let readStud;
            if (id || Name || Age || Mobile || Email) {
                let selectQuery = "SELECT * FROM studenttable where id=$1 or Name = lower($2) or Age = $3 or Mobile = $4 or Email = $5;";
                readStud = yield client.query(selectQuery, [id, Name, Age, Mobile, Email]);
            }
            else {
                readStud = yield client.query("SELECT * FROM studenttable;");
            }
            if (readStud.rowCount > 0) {
                res.status(200).send({ status: true, data: readStud.rows });
            }
            else {
                res.status(404).send({ message: "No student found" });
            }
        }
        catch (err) {
            res.status(500).send({ status: false, msg: err.message });
        }
    });
};
module.exports.updateStudent = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let data = req.body;
            let { Name, Age, Mobile, Email } = data;
            let { studentId } = req.params;
            if (Object.keys(data).length == 0) {
                return res
                    .status(400)
                    .send({ status: false, msg: "Body should not be Empty.. " });
            }
            const checkStudent = yield client.query("SELECT * FROM studenttable WHERE id= $1;", [studentId]);
            const arr = checkStudent.rows;
            if (arr.length == 0) {
                return res.status(400).json({
                    error: " No student found ⚠️⚠️"
                });
            }
            let id = Object.values(arr[0]);
            if (Name) {
                checkStudent.Name = Name;
                if (!nameRegex.test(Name))
                    return res.status(400).send({ status: false, msg: "Enter valid Name" });
                yield client.query(`Update studenttable set Name  = lower($1) where id = $2;`, [Name, studentId]);
            }
            if (Age) {
                checkStudent.Age = Age;
                if (!ageRegex.test(Age))
                    return res.status(400).send({ status: false, message: "Enter the valid Age" });
                yield client.query(`Update studenttable set Age  = $1 where id = $2;`, [Age, studentId]);
            }
            if (Mobile) {
                const checkMobile = yield client.query(`SELECT * FROM studenttable WHERE Mobile= $1;`, [Mobile]);
                const arr = checkMobile.rows;
                if (arr.length != 0) {
                    return res.status(400).json({
                        error: "This Mobile already has been used.",
                    });
                }
            }
            if (Mobile) {
                checkStudent.Mobile = Mobile;
                if (!mobileRegex.test(Mobile))
                    return res.status(400).send({ status: false, message: "Enter the valid Mobile" });
                yield client.query(`Update studenttable set Mobile  = $1 where id = $2;`, [Mobile, studentId]);
            }
            if (Email) {
                const checkEmail = yield client.query(`SELECT * FROM studenttable WHERE Email= $1;`, [Email]); //Checking if email already exists
                const arr = checkEmail.rows;
                if (arr.length != 0) {
                    return res.status(400).json({
                        error: "This Email already has been used.",
                    });
                }
            }
            if (Email) {
                checkStudent.Email = Email;
                if (!emailRegex.test(Email))
                    return res.status(400).send({ status: false, message: "Enter the valid Email" });
                yield client.query(`Update studenttable set Email  = $1 where id = $2;`, [Email, studentId]);
            }
            let date = new Date();
            let StudentId = id[0], Event = "Updated", TimeStamps = date, Description = "Student updated";
            let setFields = "insert into systemlogs(StudentId,Event,TimeStamps, Description) values($1,$2,$3,$4)";
            yield client.query(setFields.toLocaleLowerCase(), [StudentId, Event, TimeStamps, Description]);
            res
                .status(200)
                .send({
                status: true,
                msg: "Student Updted Successfully ✅✅"
            });
        }
        catch (err) {
            res.status(500).send({ status: false, msg: "Error", error: err.message });
        }
    });
};
module.exports.deleteStudent = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let delQueryData = req.query;
            const { Mobile } = delQueryData;
            if (Object.keys(delQueryData).length == 0) {
                return res
                    .status(400)
                    .send({
                    status: false,
                    message: "please enter the key Mobile",
                });
            }
            if (Object.keys(delQueryData)) {
                if (!Mobile || typeof Mobile == "undefined" || Mobile == " ") {
                    return res
                        .status(400)
                        .send({ status: false, message: "please provide the mobile number of the student which you want to delete" });
                }
            }
            let mob = Object.values(delQueryData);
            if (!mobileRegex.test(mob)) {
                return res
                    .status(400)
                    .send({
                    Status: false,
                    message: "Please enter valid Indian mobile number ⚠️⚠️",
                });
            }
            if (delQueryData) {
                const checkMobile = yield client.query(`SELECT * FROM studenttable WHERE Mobile= $1;`, [Mobile]); //Checking if mobile number already exists
                const arr = checkMobile.rows;
                if (arr.length == 0) {
                    return res.status(400).json({
                        error: "No Student found"
                    });
                }
            }
            let selidqury = "Select id from studenttable where Mobile = $1;";
            let idd = yield client.query(selidqury, [Mobile]);
            let arr = Object.values(idd.rows[0]);
            let deletequery = "Delete from studenttable where Mobile = $1 ;";
            yield client.query(deletequery, [Mobile]);
            let date = new Date();
            let StudentId = arr[0], Event = "Deleted", TimeStamps = date, Description = "Student has been deleted";
            let setFields = "insert into systemlogs(StudentId,Event,TimeStamps, Description) values($1,$2,$3,$4);";
            yield client.query(setFields.toLowerCase(), [StudentId, Event, TimeStamps, Description]);
            res.status(200).send({ status: true, msg: "Student has been deleted successfully" });
        }
        catch (err) {
            res.status(400).send({ status: false, msg: err.message });
        }
    });
};
module.exports.loginDatabase = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
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
            }
            else {
                {
                    return res
                        .status(400)
                        .send({ status: false, message: "enter the password" });
                }
            }
            if (userName) {
                const checkUserName = yield client.query(`SELECT  FROM logindatabase WHERE userName = lower($1);`, [userName]);
                const arr = checkUserName.rows;
                if (arr.length != 0) {
                    return res.status(400).json({
                        error: "This userName has already been used...please provide another userName",
                    });
                }
            }
            let insertQuery = "insert into logindatabase(userName,password) values(lower($1),lower($2));";
            yield client.query(insertQuery.toLocaleLowerCase(), [userName, password]);
            res.status(200).send({ status: true });
        }
        catch (error) {
            res.status(500).send({ status: false, error: error.message });
        }
    });
};
