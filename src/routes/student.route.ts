import express from "express";
import { StudentController } from "../controllers/student.controller";
import { Incomecontroller } from "../controllers/income.controller";
import { ExpenseController } from "../controllers/expense.controller";
import { DonorContoller } from "../controllers/donor.controller";
import { AddressController } from "../controllers/address.controller";
import { FinancialsController } from "../controllers/Financials.controller";
import { FeesController } from "../controllers/fees.controller";
import { GuardianController } from "../controllers/guardian.controller";
import { OldMadrasaInfoController } from "../controllers/oldMadrasaInfo.controller";
import { madrasaSettingsController } from "../controllers/madrasaSettings.controller";
import { upload } from "../middlewares/upload";
import { IDcontroller } from "../controllers/ID.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

const studentController = new StudentController();
const incomeController = new Incomecontroller();
const expenseController = new ExpenseController();
const donorController = new DonorContoller();
const financialsController = new FinancialsController();
const guardianController = new GuardianController();
const addressController = new AddressController();
const feesController = new FeesController();
const oldMadrasaInfoController = new OldMadrasaInfoController();
const idController = new IDcontroller()

router.use(verifyToken);

router.post(
  "/students/add-student",
  upload.single("profileImage"),
  studentController.addStudent.bind(studentController)
);

router.post(
  "/students/save-draft",
  upload.single("profileImage"),
  studentController.saveDraft.bind(studentController)
);

router.get(
  "/students/get-drafts",
  studentController.getDrafts.bind(studentController)
);

router.get(
  "/students/get-draft/:id",
  studentController.getDraftById.bind(studentController)
);

router.delete(
  "/students/delete-draft/:id",
  studentController.deleteDraft.bind(studentController)
);

router.put(
  "/students/update-draft/:id",
  upload.single("profileImage"),
  studentController.updateDraft.bind(studentController)
);

router.get(
  "/students/get_student_with_guardian_address/:id",
  studentController.getStudentWithPopulated.bind(studentController)
);
router.put(
  "/students/update-student/:id",
  upload.single("profileImage"),
  studentController.updateStudent.bind(studentController)
);

router.put(
  "/students/update-full-details/:id",
  upload.single("profileImage"),
  studentController.updateFullDetails.bind(studentController)
);
router.put(
  "/guardians/update-guardian/:id",
  guardianController.updateGuardian.bind(guardianController)
);
router.put(
  "/addresses/update-address/:id",
  addressController.updateAddress.bind(addressController)
);
router.put("/fees/update-fees/:id", feesController.updateFees.bind(feesController));
router.put(
  "/old-madrasa-info/update-old-madrasa-info/:id",
  oldMadrasaInfoController.updateOldMadrasaInfo.bind(oldMadrasaInfoController)
);
router.post(
  "/old-madrasa-info/add-old-madrasa-info",
  oldMadrasaInfoController.addOldMadrasaInfo.bind(oldMadrasaInfoController)
);
router.get(
  "/students/get-all-students",
  studentController.filterAllStudents.bind(studentController)
);
router.post(
  "/accounts/add-income",
  incomeController.addIncome.bind(incomeController)
);
router.get("/accounts/get-all-incomes", incomeController.getIncomes);
router.post(
  "/accounts/add-expense",
  expenseController.addeExpense.bind(expenseController)
);
router.get(
  "/accounts/get-all-expenses",
  expenseController.getExpenses.bind(expenseController)
);
router.post(
  "/accounts/add-donor",
  donorController.addDonor.bind(donorController)
);
router.get(
  "/accounts/get-all-donors",
  donorController.getDonors.bind(donorController)
);
router.get(
  "/financials/summary",
  financialsController.getFinancialSummary.bind(financialsController)
);

router.get("/madrasa-settings", madrasaSettingsController.get);
router.post(
  "/madrasa-settings",
  upload.single("logo"),
  madrasaSettingsController.create
);
router.patch(
  "/madrasa-settings",
  upload.single("logo"),
  madrasaSettingsController.update
);
router.post(
  "/madrasa-settings/fees",
  madrasaSettingsController.addFee
);
router.delete(
  "/madrasa-settings/fees/:feeName",
  madrasaSettingsController.removeFee
);
router.get(
  "/madrasa-settings/fee-structure",
  madrasaSettingsController.getFeeStructure
);
router.get("/get-id", idController.updateID)

export const StudentRoutes = router;