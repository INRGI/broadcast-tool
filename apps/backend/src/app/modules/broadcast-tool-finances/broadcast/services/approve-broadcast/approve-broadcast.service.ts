import { Injectable } from '@nestjs/common';
import { ApproveBroadcastSheetService } from '../approve-broadcast-sheet/approve-broadcast-sheet.service';
import { ApproveBroadcastPayload } from './approve-broadcast.payload';
import { ApproveBroadcastSheetResponseDto } from '@epc-services/interface-adapters';

@Injectable()
export class ApproveBroadcastService {
  constructor(
    private readonly approveBroadcastSheetService: ApproveBroadcastSheetService
  ) {}

  async execute(
    payload: ApproveBroadcastPayload
  ): Promise<ApproveBroadcastSheetResponseDto[]> {
    const response: ApproveBroadcastSheetResponseDto[] = [];

    for (const broadcast of payload.broadcast) {
      const result = await this.approveBroadcastSheetService.execute(broadcast);

      response.push(result);
    }

    return response;
  }
}
