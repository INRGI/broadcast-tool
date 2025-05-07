export type MondayApiProductColumnValue = {
  column: { title: string };
  text: string | null;
};

export type MondayApiProductBoardData = {
  id: string;
  name: string;
  column_values: MondayApiProductColumnValue[];
};

export interface MondayApiGetProductDataResponse {
  data: {
    boards: {
      items_page: {
        items: MondayApiProductBoardData[];
      };
    };
  };
  account_id: number;
}
