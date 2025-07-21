import { Injectable } from "@nestjs/common";
import { GetBroadcastRulesByIdPayload } from "./get-broadcast-rules-by-id.payload";
import { BroadcastRulesProps } from "../../domain/types/broadcast-rules.types";
import { BroadcastRulesRepository } from "../../../../../infrastructure/database/repositories/broadcast-rules/broadcast-rules.repository";

@Injectable()
export class GetBroadcastRulesByIdQueryService {
  constructor(
    private readonly broadcastRulesRepository: BroadcastRulesRepository
  ) {}

  public async execute(
    payload: GetBroadcastRulesByIdPayload
  ): Promise<BroadcastRulesProps> {
    const broadcastRules = await this.broadcastRulesRepository.findById(
      payload.broadcastRulesId
    );

    return broadcastRules;
  }
}
