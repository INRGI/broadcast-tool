import { Injectable } from "@nestjs/common";
import { GetClickCopiesWithSendsService } from "../../../bigQuery/services/get-click-copies-with-sends/get-click-copies-with-sends.service";
import { GetClickableCopiesBySendsPayload } from "./get-clickable-copies-by-sends.payload";

@Injectable()
export class GetClickableCopiesWithSendsService {
  constructor(
    private readonly getClickCopiesWithSendsService: GetClickCopiesWithSendsService
  ) {}

  public async execute(
    payload: GetClickableCopiesBySendsPayload
  ): Promise<string[]> {
    const { daysBeforeInterval } = payload;

    const clickableCopiesWithSends =
      await this.getClickCopiesWithSendsService.execute({
        daysBefore: daysBeforeInterval,
      });

    const filteredClickableCopies = clickableCopiesWithSends.data.filter(
      (copy) => {
        return (
          !copy.Copy.includes("_SA") &&
          !isNaN(Number(this.extractLift(copy.Copy))) &&
          this.extractLift(copy.Copy) !== "00"
        );
      }
    );

    const sortedCopies = filteredClickableCopies.sort((a, b) => {
      const ratioA = a.UC / (a.Sends + 1);
      const ratioB = b.UC / (b.Sends + 1);
      return ratioB - ratioA;
    });
    const copyNames = sortedCopies.map((copy) => copy.Copy);

    return copyNames;
  }

  private extractLift(copyName: string): string {
    const liftMatch = copyName.match(/[a-zA-Z]+(\d+)/);
    const productLift = liftMatch ? liftMatch[1] : "";
    return productLift;
  }
}
