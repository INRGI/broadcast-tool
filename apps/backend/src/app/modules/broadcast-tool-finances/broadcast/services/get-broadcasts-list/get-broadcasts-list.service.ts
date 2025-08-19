import {
  GDriveApiServicePort,
  InjectGDriveApiService,
} from "@epc-services/gdrive-api";
import {
  BroadcastSheet,
  GetBroadcastsListResponseDto,
} from "@epc-services/interface-adapters";
import { Injectable } from "@nestjs/common";
import { GetAdminBroadcastConfigByNicheQueryService } from "../../../rules/queries/get-admin-broadcast-config-by-niche/get-admin-broadcast-config-by-niche.query-service";

@Injectable()
export class GetBroadcastsListService {
  constructor(
    @InjectGDriveApiService()
    private readonly gdriveApiService: GDriveApiServicePort,
    private readonly getAdminBroadcastConfigByNicheQueryService: GetAdminBroadcastConfigByNicheQueryService
  ) {}

  public async execute(): Promise<GetBroadcastsListResponseDto> {
    const searchResult = await this.gdriveApiService.getFolderContent(
      "13Bsls3omgREiI0DyQbCauMdtHl_h0KSP",
      30
    );

    const adminConfig =
      await this.getAdminBroadcastConfigByNicheQueryService.execute({
        niche: "finance",
      });

    const filteredSearchResult: BroadcastSheet[] = searchResult.files
      .filter((file) => {
        if (
          file.mimeType === "application/vnd.google-apps.spreadsheet" &&
          !file.name.includes("Copy ") &&
          file.name.toLowerCase().includes("team")
        ) {
          if (!adminConfig.ignoringRules.broadcasts.includes(file.name)) {
            return file;
          }
        }
      })
      .map((file) => {
        return {
          fileId: file.id,
          sheetName: file.name,
        };
      });

    return {
      sheets: filteredSearchResult,
    };
  }
}
