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
    async createDocs(bodyData, session) {
        console.log(bodyData);
        const doc = new this.model(bodyData);
        return await doc.save(session ? { session } : undefined);
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
        let { page = 1, limit = 10 } = filter;
        if (!page)
            page = 1;
        if (!limit)
            limit = 10;
        const skip = Math.abs((Number(page) - 1) * Number(limit));
        delete filter.page;
        delete filter.limit;
        return await this.model.find(filter).skip(skip).limit(limit).lean().exec();
    }
    async totalDocuments(filter) {
        return await this.model.countDocuments(filter);
    }
}
exports.BaseRepository = BaseRepository;
