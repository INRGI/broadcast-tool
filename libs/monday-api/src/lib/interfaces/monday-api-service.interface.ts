export type MondayApiColumnValue = {
  column: { title: string };
  text: string | null;
};

export type MondayApiBoardData = {
  id: string;
  name: string;
  group?: { title: string };
  column_values: MondayApiColumnValue[];
};

export interface MondayApiGetDataResponse {
  data: {
    boards: {
      items_page: {
        items: MondayApiBoardData[];
        cursor?: string | null;
      };
    };
  };
  account_id: number;
}

export type MondayGroup = {
  id: string;
  title: string;
};

export type MondayApiGroupBoardData = {
  id: string;
  name: string;
  column_values: MondayApiColumnValue[];
};

export interface MondayApiGetGroupsResponse {
  data: {
    boards: {
      groups: MondayGroup[];
    };
  };
}

export interface MondayApiGetGroupDataResponse {
  data: {
    boards: {
      groups: {
        items_page: {
          items: MondayApiGroupBoardData[];
          cursor?: string | null;
        };
      };
    };
  };
}
