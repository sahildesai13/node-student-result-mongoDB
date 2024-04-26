var student = require('../model/AddStudent');
var result = require('../model/ResultModel');
const bcrypt = require('bcrypt');
const storage = require('node-persist');
storage.init();

var student_status;
exports.StudentLogin = async (req, res) => {
    student_status = await storage.getItem('login_student');
    if (student_status == undefined) {
        const data = await student.find({ "username": req.body.username });
        if (data.length == 1) {
            bcrypt.compare(req.body.password, data[0].password, async function (err, result) {
                if (result == true) {
                    await storage.setItem('login_student', data[0].id);
                    res.status(200).json({
                        status: "Student Login Success",
                        data
                    })
                } else {
                    res.status(200).json({
                        status: "Wrong Password"
                    })
                }
            });
        } else {
            res.status(200).json({
                status: "Wrong Username"
            })
        }
    } else {
        res.status(200).json({
            status: "Student Already Login"
        })
    }
}

exports.StudentLogout = async (req, res) => {
    await storage.removeItem('login_student');
    res.status(200).json({
        status: "Student Logout Success"
    })
}

exports.StudentResult = async (req, res) => {
    student_status = await storage.getItem('login_student');
    if (student_status!= undefined) {
        var data = await result.find({ 'stu_id': student_status }).populate('stu_id');
        res.status(200).json
        ({
            status: "View Result Success",
            data
        })
    } else {
        res.status(200).json
        ({
            status: "Student Not Login"
        })
    }
}
