export interface MondayApiQueryParams {
  query: string;
  variables: {
    boardId: number;
    value?: string;
    cursor?: string;
  };
}
