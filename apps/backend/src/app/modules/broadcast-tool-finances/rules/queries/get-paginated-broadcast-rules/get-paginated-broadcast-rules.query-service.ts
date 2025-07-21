import { Injectable } from "@nestjs/common";
import { BroadcastRulesRepository } from "../../../../../infrastructure/database/repositories/broadcast-rules/broadcast-rules.repository";
import { BroadcastRulesProps } from "../../domain/types/broadcast-rules.types";

@Injectable()
export class GetPaginatedBroadcastRulesQueryService {
  constructor(
    private readonly broadcastRulesRepository: BroadcastRulesRepository
  ) {}

  public async execute(): Promise<BroadcastRulesProps[]> {
    return await this.broadcastRulesRepository.findAll();
  }
}
