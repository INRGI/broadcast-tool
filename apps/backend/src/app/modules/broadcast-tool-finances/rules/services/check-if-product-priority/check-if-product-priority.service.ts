import { Injectable } from "@nestjs/common";
import { CheckIfProductPriorityPayload } from "./check-if-product-priority.payload";
import * as crypto from "crypto";

@Injectable()
export class CheckIfProductPriorityService {
  private cachedSet: Set<string> | null = null;
  private cachedHash: string | null = null;

  public async execute(
    payload: CheckIfProductPriorityPayload
  ): Promise<boolean> {
    const { product, priorityCopiesData } = payload;

    const currentHash = this.hashArray(priorityCopiesData);

    if (this.cachedHash !== currentHash) {
      this.cachedSet = new Set(priorityCopiesData);
      this.cachedHash = currentHash;
    }

    return this.cachedSet.has(product);
  }

  private hashArray(arr: string[]): string {
    const sorted = [...arr].sort();
    const joined = sorted.join("|");
    return crypto.createHash("md5").update(joined).digest("hex");
  }
}
