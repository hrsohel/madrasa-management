import express, { Router } from "express"
import { StudentController } from "../src/controllers/student.controller"
import { Incomecontroller } from "../src/controllers/income.controller"
import { ExpenseController } from "../src/controllers/expense.controller"
import { DonorContoller } from "../src/controllers/donor.controller"

const studentController = new StudentController()
const incomeController = new Incomecontroller()
const expenseController = new ExpenseController()
const donorController = new DonorContoller()
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
        this.route.get("/students/get-all-students", studentController.filterAllStudents.bind(studentController))
        this.route.post("/accounts/add-income", incomeController.addIncome.bind(incomeController))
        this.route.get("/accounts/get-all-incomes", incomeController.getIncomes)
        this.route.post("/accounts/add-expense", expenseController.addeExpense.bind(expenseController))
        this.route.get("/accounts/get-all-expenses", expenseController.getExpenses.bind(expenseController))
        this.route.post("/accounts/add-donor", donorController.addDonor.bind(donorController))
        this.route.get("/accounts/get-all-donors", donorController.getDonors.bind(donorController))
    }

    public getRouter(): Router {
        return this.route
    }
}