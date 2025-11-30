"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
const Student_repository_1 = require("../Repositories/Student.repository");
const studentRepo = new Student_repository_1.StudentRepostitory();
class StudentService {
    async addStudent(bodyData) {
        return await studentRepo.createDocs(bodyData);
    }
    async findStudentId(id) {
        return await studentRepo.findById(id);
    }
    async findAllStudent() {
        return await studentRepo.findAll();
    }
    async filterStudent(filter) {
        return await studentRepo.filterDocs(filter);
    }
    async findStudentWithIdentifier(identifier) {
        return await studentRepo.findStudentsWithPolulated(identifier);
    }
    async updateStudent(bodyData) {
        return studentRepo.updateStudent(bodyData);
    }
}
exports.StudentService = StudentService;
