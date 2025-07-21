import { Injectable } from "@nestjs/common";
import { AdminBroadcastConfigRepository } from "../../../../../infrastructure/database/repositories/broadcast-rules/admin-broadcast-config.repository";
import { CreateAdminBroadcastConfigPayload } from "./create-admin-broadcast-config.payload";
import { CreateAdminBroadcastConfigProps } from "../../domain/types/admin-broadcast-config.types";

@Injectable()
export class CreateAdminBroadcastConfigService {
  constructor(
    private readonly adminBroadcastConfigRepository: AdminBroadcastConfigRepository
  ) {}

  public async execute(
    payload: CreateAdminBroadcastConfigPayload
  ): Promise<CreateAdminBroadcastConfigProps> {
    const adminBroadcastConfigRules =
      await this.adminBroadcastConfigRepository.create(payload);

    return adminBroadcastConfigRules;
  }
}
