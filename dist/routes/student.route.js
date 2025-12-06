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
const Financials_controller_1 = require("../src/controllers/Financials.controller");
const madrasaSettings_controller_1 = require("../src/controllers/madrasaSettings.controller");
const upload_1 = require("../src/middlewares/upload");
const studentController = new student_controller_1.StudentController();
const incomeController = new income_controller_1.Incomecontroller();
const expenseController = new expense_controller_1.ExpenseController();
const donorController = new donor_controller_1.DonorContoller();
const financialsController = new Financials_controller_1.FinancialsController();
class Routes {
    constructor() {
        this.route = express_1.default.Router();
        this.studentRoutes();
        this.madrasaRoutes();
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
        this.route.get("/financials/summary", financialsController.getFinancialSummary.bind(financialsController));
    }
    madrasaRoutes() {
        this.route.get('/madrasa-settings', madrasaSettings_controller_1.madrasaSettingsController.get);
        this.route.post('/madrasa-settings', upload_1.upload.single('logo'), madrasaSettings_controller_1.madrasaSettingsController.create);
        this.route.patch('/madrasa-settings', upload_1.upload.single('logo'), madrasaSettings_controller_1.madrasaSettingsController.update);
    }
    getRouter() {
        return this.route;
    }
}
exports.Routes = Routes;
