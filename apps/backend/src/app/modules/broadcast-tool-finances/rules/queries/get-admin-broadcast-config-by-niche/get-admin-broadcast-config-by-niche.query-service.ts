import { Injectable } from "@nestjs/common";
import { AdminBroadcastConfigRepository } from "../../../../../infrastructure/database/repositories/broadcast-rules/admin-broadcast-config.repository";
import { GetAdminBroadcastConfigByNichePayload } from "./get-admin-broadcast-config-by-niche.payload";
import { AdminBroadcastConfigProps } from "../../domain/types/admin-broadcast-config.types";

@Injectable()
export class GetAdminBroadcastConfigByNicheQueryService {
  constructor(
    private readonly adminBroadcastConfigRepository: AdminBroadcastConfigRepository
  ) {}

  public async execute(
    payload: GetAdminBroadcastConfigByNichePayload
  ): Promise<AdminBroadcastConfigProps> {
    const broadcastRules =
      await this.adminBroadcastConfigRepository.findByNiche(payload.niche);

    return broadcastRules;
  }
}
