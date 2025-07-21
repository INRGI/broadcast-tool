import { Injectable } from "@nestjs/common";
import { CheckIfCopyBlacklistedPayload } from "./check-if-copy-blacklisted.payload";
import { cleanCopyName } from "../../utils/cleanCopyName";

@Injectable()
export class CheckIfCopyBlacklistedService {
  private cache: Map<string, Set<string>> = new Map();

  public async execute(
    payload: CheckIfCopyBlacklistedPayload
  ): Promise<boolean> {
    const { copyName, blacklistedCopies } = payload;
    const cleaned = cleanCopyName(copyName);

    const hash = blacklistedCopies.join("|");
    if (!this.cache.has(hash)) {
      this.cache.set(hash, new Set(blacklistedCopies));
    }

    const blacklistedSet = this.cache.get(hash);
    return blacklistedSet.has(cleaned);
  }
}
