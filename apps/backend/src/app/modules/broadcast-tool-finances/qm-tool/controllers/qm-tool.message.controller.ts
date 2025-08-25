import { Controller, Get, Param } from "@nestjs/common";
import { ValidateCopyService } from "../services/validate-copy/validate-copy.service";

@Controller("finances/broadcast-tool/qm-tool")
export class QmToolController {
  constructor(private readonly validateCopyService: ValidateCopyService) {}

  @Get("validate-copy/:copyName/:domain/:sendingDate")
  public async validateCopy(
    @Param("copyName") copyName: string,
    @Param("domain") domain: string,
    @Param("sendingDate") sendingDate: string
  ): Promise<{isValid: boolean, errors: string[]}> {
    return await this.validateCopyService.execute({
      copyName,
      domain,
      sendingDate
    });
  }
}
