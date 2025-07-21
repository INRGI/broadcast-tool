import { BroadcastDomain } from '@epc-services/interface-adapters';

export interface ApproveBroadcastSheetPayload {
  spreadsheetId: string;
  sheetName: string;
  broadcast: BroadcastDomain[];
}
