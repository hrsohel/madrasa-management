import express, { Router } from "express"
import { StudentController } from "../src/controllers/student.controller"

const studentController = new StudentController()
export class Routes {
    private route: Router
    constructor() {
        this.route = express.Router()
        this.studentRoutes()
    }

    private studentRoutes(): void {
        this.route.post("/students/add-student", studentController.addStudent.bind(studentController))
        this.route.get("/students/get_student_with_guardian_address/:id", studentController.getStudentWithPopulated.bind(studentController))
        this.route.put("/students/update-student/:id", studentController.updateStudent.bind(studentController))
    }

    public getRouter(): Router {
        return this.route
    }
}