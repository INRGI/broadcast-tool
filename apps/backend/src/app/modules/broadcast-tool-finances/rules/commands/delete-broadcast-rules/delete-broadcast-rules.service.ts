import { Injectable } from "@nestjs/common";
import { DeleteBroadcastRulesPayload } from "./delete-broadcast-rules.payload";
import { BroadcastRulesRepository } from "../../../../../infrastructure/database/repositories/broadcast-rules/broadcast-rules.repository";

@Injectable()
export class DeleteBroadcastRulesService {
  constructor(
    private readonly broadcastRulesRepository: BroadcastRulesRepository
  ) {}

  public async execute(payload: DeleteBroadcastRulesPayload): Promise<void> {
    const broadcastRules = await this.broadcastRulesRepository.delete(
      payload.id
    );
  }
}
