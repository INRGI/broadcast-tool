import { Injectable } from "@nestjs/common";
import { CheckIfCopyCanBeTestedPayload } from "./check-if-copy-can-be-tested.payload";
import { GetCopyClicksService } from "../../../bigQuery/services/get-copy-clicks/get-copy-clicks.service";
import { cleanCopyName } from "../../utils/cleanCopyName";

@Injectable()
export class CheckIfCopyCanBeTestedService {
  constructor(private readonly getCopyClicksService: GetCopyClicksService) {}

  public async execute(
    payload: CheckIfCopyCanBeTestedPayload
  ): Promise<boolean> {
    const { copyName, maxClicksToBeTestCopy } = payload;

    const cleanedTargetName = cleanCopyName(copyName);

    const { data } = await this.getCopyClicksService.execute({
      copyName: cleanedTargetName,
    });

    const totalClicks = data.reduce((acc, row) => {
      return cleanCopyName(row.Copy) === cleanedTargetName ? acc + row.UC : acc;
    }, 0);

    return totalClicks < maxClicksToBeTestCopy;
  }
}
