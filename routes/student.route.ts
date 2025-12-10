import express, { Router } from "express"
import { StudentController } from "../src/controllers/student.controller"
import { Incomecontroller } from "../src/controllers/income.controller"
import { ExpenseController } from "../src/controllers/expense.controller"
import { DonorContoller } from "../src/controllers/donor.controller"
import { AddressController } from "../src/controllers/address.controller";
import { FinancialsController } from "../src/controllers/Financials.controller"
import { FeesController } from "../src/controllers/fees.controller";
import { GuardianController } from "../src/controllers/guardian.controller";
import { OldMadrasaInfoController } from "../src/controllers/oldMadrasaInfo.controller";
import { madrasaSettingsController } from "../src/controllers/madrasaSettings.controller";
import { upload } from "../src/middlewares/upload";

const studentController = new StudentController()
const incomeController = new Incomecontroller()
const expenseController = new ExpenseController()
const donorController = new DonorContoller()
const financialsController = new FinancialsController()
const guardianController = new GuardianController()
const addressController = new AddressController()
const feesController = new FeesController()
const oldMadrasaInfoController = new OldMadrasaInfoController()

export class Routes {
    private route: Router
    constructor() {
        this.route = express.Router()
        this.studentRoutes()
        this.madrasaRoutes()
    }

    private studentRoutes(): void {
        this.route.post("/students/add-student", upload.single('profileImage'), studentController.addStudent.bind(studentController))
        this.route.get("/students/get_student_with_guardian_address/:id", studentController.getStudentWithPopulated.bind(studentController))
        this.route.put("/students/update-student/:id", studentController.updateStudent.bind(studentController))
        this.route.put("/guardians/update-guardian/:id", guardianController.updateGuardian.bind(guardianController))
        this.route.put("/addresses/update-address/:id", addressController.updateAddress.bind(addressController))
        this.route.put("/fees/update-fees/:id", feesController.updateFees.bind(feesController))
        this.route.put("/old-madrasa-info/update-old-madrasa-info/:id", oldMadrasaInfoController.updateOldMadrasaInfo.bind(oldMadrasaInfoController))
        this.route.get("/students/get-all-students", studentController.filterAllStudents.bind(studentController))
        this.route.post("/accounts/add-income", incomeController.addIncome.bind(incomeController))
        this.route.get("/accounts/get-all-incomes", incomeController.getIncomes)
        this.route.post("/accounts/add-expense", expenseController.addeExpense.bind(expenseController))
        this.route.get("/accounts/get-all-expenses", expenseController.getExpenses.bind(expenseController))
        this.route.post("/accounts/add-donor", donorController.addDonor.bind(donorController))
        this.route.get("/accounts/get-all-donors", donorController.getDonors.bind(donorController))
        this.route.get("/financials/summary", financialsController.getFinancialSummary.bind(financialsController))
    }

    private madrasaRoutes(): void {
        this.route.get('/madrasa-settings', madrasaSettingsController.get);
        this.route.post('/madrasa-settings', upload.single('logo'), madrasaSettingsController.create);
        this.route.patch('/madrasa-settings', upload.single('logo'), madrasaSettingsController.update);
    }

    public getRouter(): Router {
        return this.route
    }
}