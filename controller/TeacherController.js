var student = require('../model/AddStudent');
var staff = require('../model/AddStaff');
var result = require('../model/ResultModel');
const bcrypt = require('bcrypt');
const storage = require('node-persist');
storage.init();
var staff_status;
exports.StaffLogin = async (req, res) => {
    staff_status = await storage.getItem('login_staff');
    if (staff_status == undefined) {
        const data = await staff.find({ "username": req.body.username });
        if (data.length == 1) {
            bcrypt.compare(req.body.password, data[0].password, async function (err, result) {
                if (result == true) {
                    await storage.setItem('login_staff', data[0].id);
                    res.status(200).json({
                        status: "Staff Login Success",
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
                status: "Wrong Email"
            })
        }
    } else {
        res.status(200).json({
            status: "Staff Already Login"
        })
    }
}

exports.StaffLogout = async (req, res) => {
    await storage.removeItem('login_staff');
    res.status(200).json({
        status: "Staff Logout Success"
    })
}

exports.StaffStudent = async (req, res) => {
    staff_status = await storage.getItem('login_staff');
    if (staff_status != undefined) {
        var staff_data = await staff.findById(staff_status);
        var student_data = await student.find({ "std": staff_data.std, "div": staff_data.div });
        if (student_data.length > 0) {
            res.status(200).json({
                status: "Staff Student Success",
                student_data
            })
        } else {
            res.status(200).json({
                status: "Student Not Found"
            })
        }
    } else {
        res.status(200).json({
            status: "Staff Not Login"
        })
    }
}


exports.AddResult = async (req, res) => {
    staff_status = await storage.getItem('login_staff');
    if (staff_status != undefined) {
        var {stu_id,sub1,sub2,sub3,sub4,sub5} = req.body;
        var stu_data = await student.findById(stu_id);
        var staff_data = await staff.findById(staff_status);
        if (stu_data.div == staff_data.div && stu_data.std == staff_data.std) {
            var total = parseFloat(sub1) + parseFloat(sub2) + parseFloat(sub3) + parseFloat(sub4) + parseFloat(req.body.sub5);
            var min = Math.min(sub1, sub2, sub3, sub4, req.body.sub5);
            var max = Math.max(sub1, sub2, sub3, sub4, req.body.sub5);
            if (sub1 > 35 && sub2 > 35 && sub3 > 35 && sub4 > 35 && req.body.sub5 > 35) {
                var percentage = parseFloat((total / 500) * 100);
            }
            else {
                var percentage = "0";
            }
            var grade;
            if (sub1 > 35 && sub2 > 35 && sub3 > 35 && sub4 > 35 && req.body.sub5 > 35) {
                if (percentage >= 90) {
                    grade = "A+"
                }
                else if (percentage >= 80) {
                    grade = "A"
                }
                else if (percentage >= 70) {
                    grade = "B"
                }
                else if (percentage >= 60) {
                    grade = "C"
                }
                else if (percentage >= 50) {
                    grade = "D"
                }
                else {
                    grade = "F"
                }
            }
            else {
                grade = "***"
            }

            var temp = 0;
            if (sub1 > 35) {
                temp = temp + 1;
            }

            if (sub2 > 35) {
                temp = temp + 1;
            }

            if (sub3 > 35) {
                temp = temp + 1;
            }

            if (sub4 > 35) {
                temp = temp + 1;
            }

            if (req.body.sub5 > 35) {
                temp = temp + 1;
            }

            var status;
            if (temp == 5) {
                status = "Pass";
            } else if (temp == 4 || temp == 3) {
                status = "ATKT";
            } else {
                status = "Fail";
            }

            req.body.total = total;
            req.body.min = min;
            req.body.max = max;
            req.body.percentage = percentage;
            req.body.grade = grade;
            req.body.status = status;

            var data = await result.create(req.body);
            res.status(200).json({
                status: "Add Result Success",
                data
            })
        } else {
            res.status(200).json({
                status: "Not Allowed Add Student Result that is not in your class"
            })
        }
    } else {
        res.status(200).json({
            status: "Staff Not Login"
        })
    }
}

exports.ViewResult = async (req, res) => {
    staff_status = await storage.getItem('login_staff');
    if (staff_status != undefined) {
        var staff_data = await staff.find({ "id": staff_status });
        console.log(staff_data);
        var data = await result.find({ "stu_id.std": staff_data.std, "stu_id.div": staff_data.div }).populate('stu_id');
        res.status(200).json({
            status: "View Result Success",
            data
        })
    } else {
        res.status(200).json({
            status: "Staff Not Login"
        })
    }
}

exports.SingleResult = async (req, res) => {
    staff_status = await storage.getItem('login_staff');
    if (staff_status != undefined) {
        var staff_data = await student.find({ "id": staff_status });
        var data = await result.find({ 'stu_id': req.params.id });

        if (staff_data.div == data[0].stu_id.div && staff_data.std == data[0].stu_id.std) {
            var data = await result.find({ 'stu_id': req.params.id }).populate('stu_id');
            res.status(200).json({
                status: "View Single Result Success",
                data
            })
        } else {
            res.status(200).json({
                status: "Not Allowed View Single Result that is not in your class"
            })
        }
    } else {
        res.status(200).json({
            status: "Admin Not Login"
        })
    }
}

exports.UpdateResult = async (req, res) => {
    staff_status = await storage.getItem('login_staff');
    if (staff_status != undefined) {
        var staff_data = await staff.find({ 'id': staff_status });
        var res_data = await result.findById(req.params.id);
        if (staff_data.std == res_data.stu_id.std && staff_data.div == res_data.stu_id.div) {
            var total = parseFloat(sub1) + parseFloat(sub2) + parseFloat(sub3) + parseFloat(sub4) + parseFloat(sub5);
            var min = Math.min(sub1, sub2, sub3, sub4, sub5);
            var max = Math.max(sub1, sub2, sub3, sub4, sub5);
            if (sub1 > 35 && sub2 > 35 && sub3 > 35 && sub4 > 35 && sub5 > 35) {
                var percentage = parseFloat((total / 500) * 100);
            }
            else {
                var percentage = "0";
            }
            var grade;
            if (sub1 > 35 && sub2 > 35 && sub3 > 35 && sub4 > 35 && sub5 > 35) {
                if (percentage >= 90) {
                    grade = "A+"
                }
                else if (percentage >= 80) {
                    grade = "A"
                }
                else if (percentage >= 70) {
                    grade = "B"
                }
                else if (percentage >= 60) {
                    grade = "C"
                }
                else if (percentage >= 50) {
                    grade = "D"
                }
                else {
                    grade = "F"
                }
            }
            else {
                grade = "***"
            }

            var temp = 0;
            if (sub1 > 35) {
                temp = temp + 1;
            }

            if (sub2 > 35) {
                temp = temp + 1;
            }

            if (sub3 > 35) {
                temp = temp + 1;
            }

            if (sub4 > 35) {
                temp = temp + 1;
            }

            if (sub5 > 35) {
                temp = temp + 1;
            }

            var status;
            if (temp == 5) {
                status = "Pass";
            } else if (temp == 4 || temp == 3) {
                status = "ATKT";
            } else {
                status = "Fail";
            }
            req.body.total = total;
            req.body.min = min;
            req.body.max = max;
            req.body.percentage = Math.floor(percentage);
            req.body.grade = grade;
            req.body.status = status;
            var data = await result.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json({
                status: "Add Result Success",
                data
            })
        } else {
            res.status(200).json({
                status: "Not Allowed Update Result that is not in your class"
            })
        }
    } else {
        res.status(200).json({
            status: "Staff Not Login"
        })
    }

}

exports.DeleteResult = async (req, res) => {
    staff_status = await storage.getItem('login_staff');
    if (staff_status != undefined) {
        var staff_data = await staff.find({ 'id': staff_status });
        var res_data = await result.findById(req.params.id);
        if (staff_data.std == res_data.stu_id.std && staff_data.div == res_data.stu_id.div) {
            var data = await result.findByIdAndDelete(req.params.id);
            res.status(200).json({
                status: "Delete Result Success",
                data
            })
        } else {
            res.status(200).json({
                status: "Not Allowed Delete Result that's not in your class"
            })
        }
    } else {
        res.status(200).json({
            status: "Admin Not Login"
        })
    }
}
