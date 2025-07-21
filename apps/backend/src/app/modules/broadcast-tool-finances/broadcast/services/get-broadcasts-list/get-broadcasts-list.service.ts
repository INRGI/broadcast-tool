import {
  GDriveApiServicePort,
  InjectGDriveApiService,
} from '@epc-services/gdrive-api';
import {
  BroadcastSheet,
  GetBroadcastsListResponseDto,
} from '@epc-services/interface-adapters';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetBroadcastsListService {
  constructor(
    @InjectGDriveApiService()
    private readonly gdriveApiService: GDriveApiServicePort
  ) {}

  public async execute(): Promise<GetBroadcastsListResponseDto> {
    const searchResult = await this.gdriveApiService.getFolderContent(
      '13Bsls3omgREiI0DyQbCauMdtHl_h0KSP',
      30
    );

    const filteredSearchResult: BroadcastSheet[] = searchResult.files
      .filter((file) => {
        if (
          file.mimeType === 'application/vnd.google-apps.spreadsheet' &&
          !file.name.includes('Copy ') &&
          file.name.toLowerCase().includes('team')
        ) {
          return file;
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