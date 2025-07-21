import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { assertValidMongoId } from "../../../../modules/broadcast-tool-finances/rules/utils/mongo.utils";
import { AdminBroadcastConfig } from "../../schemas/admin-broadcast-config.schema";

@Injectable()
export class AdminBroadcastConfigRepository {
  constructor(
    @InjectModel(AdminBroadcastConfig.name)
    private readonly model: Model<AdminBroadcastConfig>
  ) {}

  async create(
    data: Partial<AdminBroadcastConfig>
  ): Promise<AdminBroadcastConfig> {
    return this.model.create(data);
  }

  async findAll(): Promise<AdminBroadcastConfig[]> {
    return this.model.find().exec();
  }

  async findById(id: string) {
    assertValidMongoId(id);

    return this.model.findById(id).exec();
  }

  async findByNiche(niche: string) {
    return this.model.findOne({ niche }).exec();
  }

  async update(id: string, data: Partial<AdminBroadcastConfig>) {
    assertValidMongoId(id);
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string) {
    assertValidMongoId(id);

    await this.model.findByIdAndDelete(id).exec();
  }
}
