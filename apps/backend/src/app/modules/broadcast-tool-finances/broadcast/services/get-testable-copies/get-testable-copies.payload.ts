export interface GetTestableCopiesPayload {
  daysBeforeInterval: number;
  maxSendsToBeTestCopy: number;
  newTestCopiesGroupNames: string[];
  useNewestTestCopies: boolean;
}
