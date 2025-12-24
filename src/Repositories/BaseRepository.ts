import { Document, Model, ClientSession } from 'mongoose';

abstract class BaseRepositoryAbstraction<T extends Document> {
  abstract createDocs(bodyData: Partial<T>, session?: ClientSession): Promise<T>;
  abstract findById(_id: string): Promise<T | null>;
  abstract findOne(uid: any): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
  abstract filterDocs(filter: any): Promise<T[]>;
}

abstract class BaseRepository<T extends Document> extends BaseRepositoryAbstraction<T> {
  constructor(protected readonly model: Model<T>) { super() }

  async createDocs(bodyData: Partial<T>, session?: ClientSession): Promise<T> {
    const doc = new this.model(bodyData);
    return await doc.save(session ? { session } : undefined);
  }

  async findById(_id: string): Promise<T | null> {
    return await this.model.findById(_id).lean().exec();
  }

  async findOne(uid: any): Promise<T | null> {
    return await this.model.findOne(uid).lean().exec();
  }

  async findAll(): Promise<T[]> {
    return await this.model.find().lean().exec();
  }

  async filterDocs(filter: any): Promise<T[]> {
    let { page = 1, limit = 100 } = filter
    if (!page) page = 1
    if (!limit) limit = 100
    const skip = Math.abs((Number(page) - 1) * Number(limit))
    delete filter.page
    delete filter.limit
    return await this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec();
  }

  async totalDocuments(filter: any): Promise<number> {
    return await this.model.countDocuments(filter)
  }
}

export { BaseRepositoryAbstraction, BaseRepository };