import { Document, Model } from 'mongoose';

abstract class BaseRepositoryAbstraction<T extends Document> {
  abstract createDocs(bodyData: Partial<T>): Promise<T>;
  abstract findById(_id: string): Promise<T | null>;
  abstract findOne(uid: any): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
  abstract filterDocs(filter: any): Promise<T[]>;
}

abstract class BaseRepository<T extends Document> extends BaseRepositoryAbstraction<T> {
  constructor(protected readonly model: Model<T>) {super()}

  async createDocs(bodyData: Partial<T>): Promise<T> {
    const doc = new this.model(bodyData);
    return await doc.save();
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
    return await this.model.find(filter).lean().exec();
  }
}

export { BaseRepositoryAbstraction, BaseRepository };