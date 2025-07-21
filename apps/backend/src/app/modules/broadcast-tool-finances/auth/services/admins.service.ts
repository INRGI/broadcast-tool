import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Admins } from "../schemas/admins.schema";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admins.name) private adminModel: Model<Admins>,
    private readonly jwtService: JwtService
  ) {}

  async login(email: string): Promise<{ token: string }> {
    const admin = await this.adminModel.findById("686e52edf7571d6dfcc371f5");
    if (!admin || !admin.emails.includes(email)) return { token: '' };

    const token = this.jwtService.sign({ email }, { expiresIn: "24h" });
    return { token };
  }
}