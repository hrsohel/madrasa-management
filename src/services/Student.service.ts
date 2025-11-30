import { StudentRepostitory } from "../Repositories/Student.repository";
const studentRepo = new StudentRepostitory()

export class StudentService {
    async addStudent(bodyData: any) {
        return await studentRepo.createDocs(bodyData)
    }
    async findStudentId(id: string) {
        return await studentRepo.findById(id)
    }
    async findAllStudent() {
        return await studentRepo.findAll()
    }
    async filterStudent(filter: any) {
        return await studentRepo.filterDocs(filter)
    }
    async findStudentWithIdentifier(identifier: any) {
        return await studentRepo.findStudentsWithPolulated(identifier)
    }
    async updateStudent(bodyData: any) {
        return studentRepo.updateStudent(bodyData)
    }
}