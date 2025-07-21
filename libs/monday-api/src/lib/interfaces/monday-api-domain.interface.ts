export type MondayApiDomainColumnValue = {
  column: { title: string };
  text: string | null;
};

export type MondayApiDomainBoardData = {
  id: string;
  name: string;
  column_values: MondayApiDomainColumnValue[];
};

export interface MondayApiGetDomainDataResponse {
  data: {
    boards: {
      items_page: {
        items: MondayApiDomainBoardData[];
      };
    };
  };
  account_id: number;
}
