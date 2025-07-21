import { BroadcastDomain } from "../../../types/broadcast-tool";

export interface ApproveBroadcastSheetRequest{
  spreadsheetId: string;
  sheetName: string;
  broadcast: BroadcastDomain[];
}
