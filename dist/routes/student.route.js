"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const express_1 = __importDefault(require("express"));
const student_controller_1 = require("../src/controllers/student.controller");
const income_controller_1 = require("../src/controllers/income.controller");
const expense_controller_1 = require("../src/controllers/expense.controller");
const donor_controller_1 = require("../src/controllers/donor.controller");
const studentController = new student_controller_1.StudentController();
const incomeController = new income_controller_1.Incomecontroller();
const expenseController = new expense_controller_1.ExpenseController();
const donorController = new donor_controller_1.DonorContoller();
class Routes {
    constructor() {
        this.route = express_1.default.Router();
        this.studentRoutes();
    }
    studentRoutes() {
        this.route.post("/students/add-student", studentController.addStudent.bind(studentController));
        this.route.get("/students/get_student_with_guardian_address/:id", studentController.getStudentWithPopulated.bind(studentController));
        this.route.put("/students/update-student/:id", studentController.updateStudent.bind(studentController));
        this.route.get("/students/get-all-students", studentController.filterAllStudents.bind(studentController));
        this.route.post("/accounts/add-income", incomeController.addIncome.bind(incomeController));
        this.route.get("/accounts/get-all-incomes", incomeController.getIncomes);
        this.route.post("/accounts/add-expense", expenseController.addeExpense.bind(expenseController));
        this.route.get("/accounts/get-all-expenses", expenseController.getExpenses.bind(expenseController));
        this.route.post("/accounts/add-donor", donorController.addDonor.bind(donorController));
        this.route.get("/accounts/get-all-donors", donorController.getDonors.bind(donorController));
    }
    getRouter() {
        return this.route;
    }
}
exports.Routes = Routes;
