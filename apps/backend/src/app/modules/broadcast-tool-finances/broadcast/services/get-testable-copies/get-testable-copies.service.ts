import { Injectable } from "@nestjs/common";
import { GetTestableCopiesPayload } from "./get-testable-copies.payload";
import { GetCopiesForTestService } from "../../../bigQuery/services/get-copies-for-test/get-copies-for-test.service";
import { GetNewTestCopiesService } from "../../../monday/services/get-new-test-copies/get-new-test-copies.service";

@Injectable()
export class GetTestableCopiesService {
  constructor(
    private readonly getCopiesForTestService: GetCopiesForTestService,
    private readonly getNewTestCopiesService: GetNewTestCopiesService
  ) {}

  public async execute(payload: GetTestableCopiesPayload): Promise<string[]> {
    const { daysBeforeInterval, maxSendsToBeTestCopy } = payload;

    const testableCopies = await this.getCopiesForTestService.execute({
      daysBefore: daysBeforeInterval,
    });

    const newTestCopies = await this.getNewTestCopiesService.execute();

    const formattedNewTestCopies = newTestCopies.map((copy) => {
      return {
        ...copy,
        copyName: copy.copyName.replace(" ", ""),
      };
    });

    const sortedNewTestCopies = formattedNewTestCopies.sort((a, b) => {
      return b.createDate.localeCompare(a.createDate);
    });

    const filteredTestableCopies = testableCopies.data.filter((copy) => {
      return (
        copy.Copy &&
        !copy.Copy.includes("_SA") &&
        !isNaN(Number(this.extractLift(copy.Copy))) &&
        this.extractLift(copy.Copy) !== "00" &&
        copy.Sends < maxSendsToBeTestCopy
      );
    });

    const result = sortedNewTestCopies.filter((copy) => {
      return filteredTestableCopies.some(
        (testableCopy) => testableCopy.Copy === copy.copyName
      );
    });

    const shuffledResult = [...result.map((copy) => copy.copyName)];
    for (let i = shuffledResult.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledResult[i], shuffledResult[j]] = [
        shuffledResult[j],
        shuffledResult[i],
      ];
    }

    return shuffledResult;
  }

  private extractLift(copyName: string): string {
    const liftMatch = copyName.match(/[a-zA-Z]+(\d+)/);
    const productLift = liftMatch ? liftMatch[1] : "";
    return productLift;
  }
}
