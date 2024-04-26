var admin = require('../model/AdminRegister');
var student = require('../model/AddStudent');
var staff = require('../model/AddStaff');
var result = require('../model/ResultModel');
var std_div = require('../model/StdDiv');
const bcrypt = require('bcrypt');
const storage = require('node-persist');
storage.init();
var admin_status;

exports.AdminRegister = async (req, res) => {
    var count = await admin.find();
    console.log(count);

    if (count.length > 0) {
        res.status(200).json({
            status: "Only One Admin Exist"
        });
    } else {
        var b_pass = await bcrypt.hash(req.body.password, 10);
        req.body.password = b_pass;

        var email = req.body.email;
        var existing = await admin.findOne({ email });

        if (existing) {
            res.status(200).json({
                status: "Admin Already Exist"
            });
        } else {
            var data = await admin.create(req.body);
            res.status(200).json({
                status: "Admin Register Success",
                data
            });
        }
    }
}

exports.AdminLogin = async (req, res) => {
    admin_status = await storage.getItem('login_admin');
    if (admin_status) {
        res.status(200).json({
            status: "Admin Already Login"
        })
    } else {
        const data = await admin.find({ "email": req.body.email });
        if (data.length == 1) {
            bcrypt.compare(req.body.password, data[0].password, async function (err, result) {
                if (result == true) {
                    await storage.setItem('login_admin', data[0].id);
                    res.status(200).json({
                        status: "Admin Login Success",
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
    }
}

exports.AdminLogout = async (req, res) => {
    await storage.removeItem('login_admin');
    res.status(200).json({
        status: "Admin Logout Success",
        data: admin_status
    })
}

exports.AddStdDiv = async (req, res) => {
    admin_status = await storage.getItem('login_admin');
    if (admin_status != undefined) {
        var existing = await std_div.findOne({ "std": req.body.std, "div": req.body.div });
        if (existing) {
            res.status(200).json({
                status: "Division & Standard Already Exist"
            })
        } else {
            var data = await std_div.create(req.body);
            res.status(200).json({
                status: "Add Division & Standard Success",
                data
            })
        }
    } else {
        res.status(200).json({
            status: "Admin Not Login"
        })
    }
}

exports.ViewStdDiv = async (req, res) => {
    admin_status = await storage.getItem('login_admin');
    if (admin_status != undefined) {
        var data = await std_div.find();
        res.status(200).json({
            status: "View Division & Standard Success",
            data
        })
    } else {
        res.status(200).json({
            status: "Admin Not Login"
        })
    }
}

exports.AddStaff = async (req, res) => {
    admin_status = await storage.getItem('login_admin');
    if (admin_status != undefined) {
        var b_pass = await bcrypt.hash(req.body.password, 10);
        req.body.password = b_pass;
        let existing = await staff.findOne({ username: req.body.username });
        let std_div_exist = await std_div.findOne({ "std": req.body.std, "div": req.body.div });
        if (existing) {
            res.status(200).json({
                status: "Username Already Exist"
            })
        } else {
            if (std_div_exist) {
                var data = await staff.create(req.body);
                res.status(200).json({
                    status: "Add Staff Success",
                    data
                })
            } else {
                res.status(200).json({
                    status: "Division & Standard Not Exist"
                })
            }
        }
    }
}

exports.ViewStaff = async (req, res) => {
    admin_status = await storage.getItem('login_admin');
    if (admin_status != undefined) {
        var data = await staff.find();
        res.status(200).json({
            status: "View Staff Success",
            data
        })
    }
}

exports.UpdateStaff = async (req, res) => {
    admin_status = await storage.getItem('login_admin');
    if (admin_status != undefined) {

        // var b_pass = await bcrypt.hash(req.body.password, 10);
        // req.body.password = b_pass;

        var existing = await staff.findOne({ "username": req.body.username });
        let std_div_exist = await std_div.findOne({ "std": req.body.std, "div": req.body.div });

        // if (existing) {
        //     res.status(200).json({
        //         status: "Username Already Exist"
        //     })
        // }else{
        if (std_div_exist) {
            var data = await staff.findByIdAndUpdate(req.params.id, { std: req.body.std, div: req.body.div }, { new: true });
            res.status(200).json({
                status: "Update Staff Success",
                data
            })
        } else {
            res.status(200).json({
                status: "Division & Standard Not Exist"
            })
        }
        // }
    }
}

exports.DeleteStaff = async (req, res) => {
    admin_status = await storage.getItem('login_admin');
    if (admin_status != undefined) {
        var data = await staff.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: "Delete Staff Success",
            data
        })
    }
}

exports.AddStudent = async (req, res) => {
    admin_status = await storage.getItem('login_admin');
    if (admin_status != undefined) {
        var b_pass = await bcrypt.hash(req.body.password, 10);
        req.body.password = b_pass;

        var existing = await student.findOne({ "username": req.body.username });
        var std_div_exist = await std_div.findOne({ "std": req.body.std, "div": req.body.div });

        if (existing) {
            res.status(200).json({
                status: "Username Already Exist"
            })
        } else {

            if (std_div_exist) {
                var data = await student.create(req.body);
                res.status(200).json({
                    status: "Student Add Success",
                    data
                })
            } else {
                res.status(200).json({
                    status: "Division & Standard Not Exist"
                })
            }
        }
    } else {
        res.status(200).json({
            status: "Admin Not Login"
        })
    }
}

exports.ViewStudent = async (req, res) => {
    admin_status = await storage.getItem('login_admin');
    if (admin_status != undefined) {
        var data = await student.find();
        res.status(200).json({
            status: "View Student Success",
            data
        })
    } else {
        res.status(200).json({
            status: "Admin Not Login"
        })
    }
}

exports.StdDivWise = async (req, res) => {
    admin_status = await storage.getItem('login_admin');
    if (admin_status != undefined) {
        const { std, div } = req.query;

        let query = {};
        if (std && div) {
            query = { std, div };
        }
        var std_div_exist = await std_div.findOne({ "std": req.query.std, "div": req.query.div });

        if (std_div_exist) {
            var data = await student.find(query);
            if (data.length > 0) {
                res.status(200).json({
                    status: "View Student Success",
                    data
                });
            } else {
                res.status(200).json({
                    status: "Student Not Found"
                });
            }
        } else {
            res.status(200).json({
                status: "Division & Standard Not Exist"
            });
        }
    } else {
        res.status(200).json({
            status: "Admin Not Login"
        });
    }
}

exports.Top3Result = async (req, res) => {
    admin_status = await storage.getItem('login_admin');
    if (admin_status != undefined) {
        const { std, div } = req.query;
        var std_div_exist = await std_div.findOne({ 'std': std, 'div': div });
        if (std_div_exist) {
            const data = await student.find({ 'std': std, 'div': div }).limit(3);
            const top_data = await result.find({ 'stu_id.std': data.std, 'stu_id.div': data.div }).sort({ percentage: -1 }).limit(3).populate('stu_id');
            res.status(200).json({
                status: "View Top-3 Result Success",
                top_data
            })
        } else {
            res.status(200).json({
                status: "Division & Standard Not Exist"
            })
        }

    } else {
        res.status(200).json({
            status: "Admin Not Login"
        })
    }
}