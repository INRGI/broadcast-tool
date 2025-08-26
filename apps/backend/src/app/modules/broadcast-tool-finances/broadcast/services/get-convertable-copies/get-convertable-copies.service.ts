import { Injectable } from "@nestjs/common";
import { GetConvertableCopiesPayload } from "./get-convertable-copies.payload";
import { GetCopiesWithConversionsService } from "../../../bigQuery/services/get-copies-with-conversions/get-copies-with-conversions.service";

@Injectable()
export class GetConvertableCopiesService {
  constructor(
    private readonly getCopiesWithConversionsService: GetCopiesWithConversionsService
  ) {}

  public async execute(
    payload: GetConvertableCopiesPayload
  ): Promise<string[]> {
    const { daysBeforeInterval, broadcastName } = payload;

    const team = this.extractTeamColor(broadcastName || "");

    const convertableCopies =
      await this.getCopiesWithConversionsService.execute({
        daysBefore: daysBeforeInterval,
        team: team ? `${team} Team` : undefined,
      });

    const filtered = convertableCopies.data.filter((copy) => {
      return (
        !copy.Copy.includes("_SA") &&
        !isNaN(Number(this.extractLift(copy.Copy))) &&
        this.extractLift(copy.Copy) !== "00"
      );
    });

    // const alpha = 1; // CONVERSION
    // const beta = 800; // CLICKS

    // const scored = filtered
    //   .map((copy) => {
    //     const conversions = Number(copy.Conversion || 0);
    //     const clicks = Number(copy.UC || 0);
    //     const score = (conversions + alpha) / (clicks + alpha + beta);

    //     return {
    //       name: copy.Copy,
    //       conversions,
    //       clicks,
    //       score,
    //     };
    //   })
    //   .sort((a, b) => b.score - a.score);

    return filtered.map((c) => c.Copy);
  }

  private extractLift(copyName: string): string {
    const liftMatch = copyName.match(/[a-zA-Z]+(\d+)/);
    const productLift = liftMatch ? liftMatch[1] : "";
    return productLift;
  }

  private extractTeamColor(str: string) {
    const colors = [
      "Jade",
      "Green",
      "Tiffany",
      "Purple",
      "Blue",
      "Red",
      "Yellow",
    ];
    const match = str.match(new RegExp(colors.join("|"), "i"));
    return match ? match[0] : null;
  }
}
