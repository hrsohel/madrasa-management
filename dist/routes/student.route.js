"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const express_1 = __importDefault(require("express"));
const student_controller_1 = require("../src/controllers/student.controller");
const studentController = new student_controller_1.StudentController();
class Routes {
    constructor() {
        this.route = express_1.default.Router();
        this.studentRoutes();
    }
    studentRoutes() {
        this.route.post("/students/add-student", studentController.addStudent.bind(studentController));
        this.route.get("/students/get_student_with_guardian_address/:id", studentController.getStudentWithPopulated.bind(studentController));
        this.route.put("/students/update-student/:id", studentController.updateStudent.bind(studentController));
    }
    getRouter() {
        return this.route;
    }
}
exports.Routes = Routes;
