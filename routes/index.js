var express = require('express');
var router = express.Router();
var Admin = require('../controller/AdminController');
var Teacher = require('../controller/TeacherController');
var Student = require('../controller/StudentController');

router.post('/AdminRegister', Admin.AdminRegister);
router.post('/AdminLogin', Admin.AdminLogin);
router.get('/AdminLogout', Admin.AdminLogout);
router.post('/AddStdDiv', Admin.AddStdDiv);
router.get('/ViewStdDiv', Admin.ViewStdDiv);
router.post('/AddStaff', Admin.AddStaff);
router.get('/ViewStaff', Admin.ViewStaff);
router.post('/UpdateStaff/:id', Admin.UpdateStaff);
router.post('/DeleteStaff/:id', Admin.DeleteStaff);
router.post('/AddStudent', Admin.AddStudent);
router.get('/ViewStudent', Admin.ViewStudent);
router.get('/StdDivWise', Admin.StdDivWise);
router.get('/Top3Result', Admin.Top3Result);

// - employee -------------------------------------
router.post('/StaffLogin', Teacher.StaffLogin);
router.get('/StaffLogout', Teacher.StaffLogout);
router.get('/StaffStudent', Teacher.StaffStudent);
router.post('/AddResult', Teacher.AddResult);
router.get('/ViewResult', Teacher.ViewResult);
router.post('/UpdateResult/:id', Teacher.UpdateResult);
router.get('/DeleteResult/:id', Teacher.DeleteResult);
router.get('/SingleResult/:id', Teacher.SingleResult);

// Student --------------------------------
router.post('/StudentLogin', Student.StudentLogin);
router.get('/StudentLogout', Student.StudentLogout);
router.get('/StudentResult', Student.StudentResult);

module.exports = router;
