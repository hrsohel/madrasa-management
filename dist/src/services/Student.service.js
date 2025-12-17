"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
const Student_repository_1 = require("../Repositories/Student.repository");
const studentRepo = new Student_repository_1.StudentRepostitory();
class StudentService {
    async addStudent(bodyData, session) {
        return await studentRepo.createDocs(bodyData, session);
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
    async updateStudent(bodyData, session) {
        return studentRepo.updateStudent(bodyData, session);
    }
    async findDrafts(userId) {
        return await studentRepo.findDraftsWithDetails(userId);
    }
    async deleteStudent(id) {
        return await studentRepo.deleteStudent(id);
    }
}
exports.StudentService = StudentService;
