import { Injectable } from "@nestjs/common";
import { GetClickableCopiesPayload } from "./get-clickable-copies.payload";
import { GetCopiesWithClicksService } from "../../../bigQuery/services/get-copies-with-clicks/get-copies-with-clicks.service";

@Injectable()
export class GetClickableCopiesService {
  constructor(
    private readonly getCopiesWithClicksService: GetCopiesWithClicksService
  ) {}

  public async execute(payload: GetClickableCopiesPayload): Promise<string[]> {
    const { daysBeforeInterval, broadcastName } = payload;

    const team = this.extractTeamColor(broadcastName || "");

    const clickableCopies = await this.getCopiesWithClicksService.execute({
      daysBefore: daysBeforeInterval,
      team: team ? `${team} Team` : undefined,
    });

    const filteredClickableCopies = clickableCopies.data.filter((copy) => {
      return (
        !copy.Copy.includes("_SA") &&
        !isNaN(Number(this.extractLift(copy.Copy))) &&
        this.extractLift(copy.Copy) !== "00"
      );
    });

    return filteredClickableCopies.map((copy) => copy.Copy);
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
