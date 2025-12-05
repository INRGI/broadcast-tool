import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createOrUpdate(payload: { email: string; name?: string; lastLogin?: Date }) {
    const { email, name, lastLogin } = payload;

    const updated = await this.userModel.findOneAndUpdate(
      { email },
      {
        $set: {
          ...(name && { name }),
          ...(lastLogin && { lastLogin }),
        },
      },
      { upsert: true, new: true }
    );

    return updated;
  }

  async findAll() {
    return this.userModel.find().exec();
  }
}
