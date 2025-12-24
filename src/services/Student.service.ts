import { ClientSession } from "mongoose";
import { StudentRepostitory } from "../Repositories/Student.repository";
const studentRepo = new StudentRepostitory()

export class StudentService {
    async addStudent(bodyData: any, session?: ClientSession) {
        return await studentRepo.createDocs(bodyData, session)
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
    async updateStudent(bodyData: any, session?: ClientSession) {
        return studentRepo.updateStudent(bodyData, session)
    }
    async findByUid(uid: string, userId: string) {
        return await studentRepo.findOne({ uid, userId });
    }
    async findByIdOrUid(id: string | undefined, uid: string, userId: string) {
        if (id) {
            return await studentRepo.findOne({ $or: [{ _id: id }, { uid }], userId });
        }
        return await studentRepo.findOne({ uid, userId });
    }
    async findDrafts(userId: string) {
        return await studentRepo.findDraftsWithDetails(userId);
    }
    async deleteStudent(id: string) {
        return await studentRepo.deleteStudent(id);
    }
}