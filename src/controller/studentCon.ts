

export { }

const jwt = require("jsonwebtoken");
const client = require("../connection")


let nameRegex = /^[a-zA-Z ]+$/;

let ageRegex = /^[1-9]?[0-9]{1}$|^100$/;

let mobileRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;

let emailRegex =
  /^[a-z]{1}[a-z0-9._]{1,100}[@]{1}[a-z]{2,15}[.]{1}[a-z]{2,10}$/;


const isValid = function (value: any) {
  if (typeof value == "string" && value.trim().length == 0) {

    return false;
  }
  return true;
};


module.exports.createStudent = async function (req: any, res: any) {
  try {
    let data = req.body;
    let { Name, Age, Mobile, Email } = data;

    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "Body should not be Empty.. " });
    }

    // if (!id || typeof id == "undefined" || id == " ") {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: "Please enter some id" });
    // }
    // if (typeof id != "number") {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: "Please enter valid id" });
    // }

    // if (id) {
    //   const checkId = await client.query(`SELECT * FROM studenttable WHERE id= ($1);`.toLowerCase(), [id]);
    //   const arr = checkId.rows;
    //   if (arr.length != 0) {
    //     return res.status(400).json({
    //       error: "Please provide some other id...this id has been used ⚠️⚠️"
    //     });
    //   }
    // }

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
      const checkMobile = await client.query(`SELECT * FROM studenttable WHERE Mobile= $1`, [Mobile]); //Checking if mobile number already exists
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
      const checkEmail = await client.query(`SELECT * FROM studenttable WHERE Email= ($1);`, [Email]); //Checking if email already exists
      const arr = checkEmail.rows;
      if (arr.length != 0) {
        return res.status(400).json({
          error: "Email already there, No need to register again.",
        });
      }
    }

    let date: Date = new Date();

      

    let insertQuery: any = "insert into studenttable(Name, Age, Mobile, Email) values(lower($1),$2,$3,$4)"
    await client.query(insertQuery, [ Name, Age, Mobile, Email]);

let idQuery="Select * from studenttable where Mobile = $1;"
let qury=await client.query(idQuery,[Mobile])

let id=Object.values(qury.rows[0])
console.log(id[0])

    let StudentId = id[0], Event = "Created", TimeStamps = date, Description = "Student has been added"

    let setFields = "insert into systemlogs(StudentId,Event,TimeStamps, Description) values($1,$2,$3,$4)"
    await client.query(setFields, [StudentId, Event, TimeStamps, Description])

    res
      .status(200)
      .send({
        status: true,
        msg: "Student Added Successfully ✅✅",
        data: {Name, Age, Mobile, Email }
      });


  } catch (error: any) {
    res.status(500).send({ status: false, error: error.message });
  }
};

let validatePassword = (password: any) => {
  var pass = /^(?=.*?[A-Za-z0-9#?!@$%^&*-]).{8,15}$/;
  return pass.test(password);
};


module.exports.loginStudent = async function (req: any, res: any) {
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

    let arr
    if (userName) {
      const checkUserName = await client.query(`SELECT * FROM logindatabase WHERE userName = lower($1) And password = lower($2);`, [userName, password])
      arr = checkUserName.rows;
      if (arr.length == 0) {
        return res.status(400).json({
          error: "userName or password is not correct",
        });
      }
    }

    let dta = Object.values(arr[0])


    let token = jwt.sign(
      {
        studentdata: dta.toString(),
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
  } catch (err: any) {
    res.status(500).send({ msg: "Error", error: err.message });
  }
};

module.exports.getStudents = async function (req: any, res: any) {
  try {
    let q = req.query;
    let { id, Name, Age, Mobile, Email } = q

    let readStud
    if (id || Name || Age || Mobile || Email) {

      let selectQuery = "SELECT * FROM studenttable where id=$1 or Name = lower($2) or Age = $3 or Mobile = $4 or Email = $5;"
      readStud = await client.query(selectQuery, [id, Name, Age, Mobile, Email]);
    }

    else {
      readStud = await client.query("SELECT * FROM studenttable;")
    }


    if (readStud.rowCount > 0) {
      res.status(200).send({ status: true, data: readStud.rows })
    } else {
      res.status(404).send({ message: "No student found" });
    }
  }
  catch (err: any) {
    res.status(500).send({ status: false, msg: err.message });
  }
}


module.exports.updateStudent = async function (req: any, res: any) {
  try {
    let data = req.body;
    let { Name, Age, Mobile, Email } = data;
    let { studentId } = req.params

    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "Body should not be Empty.. " });
    }
    const checkStudent = await client.query("SELECT * FROM studenttable WHERE id= $1;", [studentId]);
    const arr = checkStudent.rows;
    if (arr.length == 0) {
      return res.status(400).json({
        error: " No student found ⚠️⚠️"
      });
    }

    let id = Object.values(arr[0])

    if (Name) {
      checkStudent.Name = Name;
      if (!nameRegex.test(Name)) return res.status(400).send({ status: false, msg: "Enter valid Name" });
      await client.query(`Update studenttable set Name  = lower($1) where id = $2;`, [Name, studentId])
    }

    if (Age) {
      checkStudent.Age = Age;
      if (!ageRegex.test(Age)) return res.status(400).send({ status: false, message: "Enter the valid Age" });
      await client.query(`Update studenttable set Age  = $1 where id = $2;`, [Age, studentId])
    }

    if (Mobile) {
      const checkMobile = await client.query(`SELECT * FROM studenttable WHERE Mobile= $1;`, [Mobile]);
      const arr = checkMobile.rows;
      if (arr.length != 0) {
        return res.status(400).json({
          error: "This Mobile already has been used.",
        });
      }
    }

    if (Mobile) {
      checkStudent.Mobile = Mobile;
      if (!mobileRegex.test(Mobile)) return res.status(400).send({ status: false, message: "Enter the valid Mobile" });
      await client.query(`Update studenttable set Mobile  = $1 where id = $2;`, [Mobile, studentId])
    }

    if (Email) {
      const checkEmail = await client.query(`SELECT * FROM studenttable WHERE Email= $1;`, [Email]); //Checking if email already exists
      const arr = checkEmail.rows;
      if (arr.length != 0) {
        return res.status(400).json({
          error: "This Email already has been used.",
        });
      }
    }

    if (Email) {
      checkStudent.Email = Email;
      if (!emailRegex.test(Email)) return res.status(400).send({ status: false, message: "Enter the valid Email" });
      await client.query(`Update studenttable set Email  = $1 where id = $2;`, [Email, studentId])
    }

    let date = new Date()
    let StudentId = id[0], Event = "Updated", TimeStamps = date, Description = "Student updated"
    let setFields = "insert into systemlogs(StudentId,Event,TimeStamps, Description) values($1,$2,$3,$4)"
    await client.query(setFields.toLocaleLowerCase(), [StudentId, Event, TimeStamps, Description])
    res
      .status(200)
      .send({
        status: true,
        msg: "Student Updted Successfully ✅✅"
      });
  } catch (err: any) {
    res.status(500).send({ status: false, msg: "Error", error: err.message });
  }
};


module.exports.deleteStudent = async function (req: any, res: any) {
  try {
    let delQueryData = req.query;
    const { Mobile } = delQueryData;
    if (Object.keys(delQueryData).length == 0) {
      return res
        .status(400)
        .send({
          status: false,
          message:
            "please enter the key Mobile",
        });
    }

    if (Object.keys(delQueryData)) {
      if (!Mobile || typeof Mobile == "undefined" || Mobile == " ") {
        return res
          .status(400)
          .send({ status: false, message: "please provide the mobile number of the student which you want to delete" });
      }
    }
    let mob: any = Object.values(delQueryData)

    if (!mobileRegex.test(mob)) {
      return res
        .status(400)
        .send({
          Status: false,
          message: "Please enter valid Indian mobile number ⚠️⚠️",
        });
    }

    if (delQueryData) {
      const checkMobile = await client.query(`SELECT * FROM studenttable WHERE Mobile= $1;`, [Mobile]); //Checking if mobile number already exists
      const arr = checkMobile.rows;
      if (arr.length == 0) {
        return res.status(400).json({
          error: "No Student found"
        });
      }
    }

    let selidqury = "Select id from studenttable where Mobile = $1;"

    let idd = await client.query(selidqury, [Mobile])

    let arr = Object.values(idd.rows[0])

    let deletequery: any = "Delete from studenttable where Mobile = $1 ;"
    await client.query(deletequery, [Mobile])

    let date = new Date()

    let StudentId = arr[0], Event = "Deleted", TimeStamps = date, Description = "Student has been deleted"
    let setFields = "insert into systemlogs(StudentId,Event,TimeStamps, Description) values($1,$2,$3,$4);"
    await client.query(setFields.toLowerCase(), [StudentId, Event, TimeStamps, Description])
    res.status(200).send({ status: true, msg: "Student has been deleted successfully" });
  }
  catch (err: any) {
    res.status(400).send({ status: false, msg: err.message })
  }
}


module.exports.loginDatabase = async function (req: any, res: any) {
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
    if (userName) {
      const checkUserName = await client.query(`SELECT  FROM logindatabase WHERE userName = lower($1);`, [userName])
      const arr = checkUserName.rows;
      if (arr.length != 0) {
        return res.status(400).json({
          error: "This userName has already been used...please provide another userName",
        });
      }
    }

    let insertQuery: any = "insert into logindatabase(userName,password) values(lower($1),lower($2));"
    await client.query(insertQuery.toLocaleLowerCase(), [userName, password]);

    res.status(200).send({ status: true });
  } catch (error: any) {
    res.status(500).send({ status: false, error: error.message });
  }
};


