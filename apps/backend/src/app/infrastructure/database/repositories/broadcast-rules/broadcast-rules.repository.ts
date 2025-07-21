import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BroadcastRules } from '../../schemas/broadcast-rules.schema';
import { assertValidMongoId } from '../../../../modules/broadcast-tool-finances/rules/utils/mongo.utils';

@Injectable()
export class BroadcastRulesRepository {
  constructor(
    @InjectModel(BroadcastRules.name)
    private readonly model: Model<BroadcastRules>
  ) {}

  async create(data: Partial<BroadcastRules>): Promise<BroadcastRules> {
    return this.model.create(data);
  }

  async findAll(): Promise<BroadcastRules[]> {
    return this.model.find().exec();
  }

  async findById(id: string) {
    assertValidMongoId(id);

    return this.model.findById(id).exec();
  }

  async update(id: string, data: Partial<BroadcastRules>) {
    assertValidMongoId(id);
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string) {
    assertValidMongoId(id);

    await this.model.findByIdAndDelete(id).exec();
  }
}
