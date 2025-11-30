"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = exports.BaseRepositoryAbstraction = void 0;
class BaseRepositoryAbstraction {
}
exports.BaseRepositoryAbstraction = BaseRepositoryAbstraction;
class BaseRepository extends BaseRepositoryAbstraction {
    constructor(model) {
        super();
        this.model = model;
    }
    async createDocs(bodyData) {
        const doc = new this.model(bodyData);
        return await doc.save();
    }
    async findById(_id) {
        return await this.model.findById(_id).lean().exec();
    }
    async findOne(uid) {
        return await this.model.findOne(uid).lean().exec();
    }
    async findAll() {
        return await this.model.find().lean().exec();
    }
    async filterDocs(filter) {
        return await this.model.find(filter).lean().exec();
    }
}
exports.BaseRepository = BaseRepository;
