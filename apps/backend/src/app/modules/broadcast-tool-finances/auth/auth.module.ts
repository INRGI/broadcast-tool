import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserService } from "./services/user.service";
import { User, UserSchema } from "./schemas/user.schema";
import { AuthController } from "./controllers/auth.controller";
import { Admins, AdminsSchema } from "./schemas/admins.schema";
import { AdminsService } from "./services/admins.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Admins.name, schema: AdminsSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_ADMIN_BROADCAST,
      signOptions: { expiresIn: "24h" },
    }),
  ],
  providers: [UserService, AdminsService],
  controllers: [AuthController],
  exports: [UserService, AdminsService, JwtModule],
})
export class AuthModule {}
