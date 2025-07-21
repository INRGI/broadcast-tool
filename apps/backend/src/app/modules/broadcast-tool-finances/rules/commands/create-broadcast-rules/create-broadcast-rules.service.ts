import { Injectable } from "@nestjs/common";
import { CreateBroadcastRulesPayload } from "./create-broadcast-rules.payload";
import { BroadcastRulesRepository } from "../../../../../infrastructure/database/repositories/broadcast-rules/broadcast-rules.repository";
import { CreateBroadcastRulesProps } from "../../domain/types/broadcast-rules.types";

@Injectable()
export class CreateBroadcastRulesService {
  constructor(
    private readonly broadcastRulesRepository: BroadcastRulesRepository
  ) {}

  public async execute(
    payload: CreateBroadcastRulesPayload
  ): Promise<CreateBroadcastRulesProps> {
    const broadcastRules = await this.broadcastRulesRepository.create(payload);

    return broadcastRules;
  }
}
