import { Injectable } from "@nestjs/common";
import { AdminBroadcastConfigRepository } from "../../../../../infrastructure/database/repositories/broadcast-rules/admin-broadcast-config.repository";
import { UpdateAdminBroadcastConfigPayload } from "./update-admin-broadcast-config.payload";
import { UpdateAdminBroadcastConfigProps } from "../../domain/types/admin-broadcast-config.types";

@Injectable()
export class UpdateAdminBroadcastConfigService {
  constructor(
    private readonly adminBroadcastConfigRepository: AdminBroadcastConfigRepository
  ) {}

  public async execute(
    payload: UpdateAdminBroadcastConfigPayload
  ): Promise<UpdateAdminBroadcastConfigProps> {
    const adminBroadcastConfig =
      await this.adminBroadcastConfigRepository.findById(payload._id);

    if (!adminBroadcastConfig) {
      throw new Error("Admin broadcast config not found");
    }

    const updatedAdminBroadcastConfig =
      await this.adminBroadcastConfigRepository.update(payload._id, {
        niche: payload.niche,
        testingRules: payload.testingRules,
        partnerRules: payload.partnerRules,
        domainRules: payload.domainRules,
        analyticSelectionRules: payload.analyticSelectionRules,
      });

    return updatedAdminBroadcastConfig;
  }
}
