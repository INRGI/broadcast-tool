export class MondayApiUtils {
  public static queryData(boardId: number, searchName: string) {
    return {
      query: `
        query ($boardId: ID!, $value: CompareValue!) {
          boards(ids: [$boardId]) {
            items_page(query_params: {rules: [{column_id: "name", compare_value: $value, operator: starts_with} ]}) {
              items {
                id
                name
                group {
                  title
                }
                column_values {
                  column {
                    title
                  }
                  text
                }
              }
            }
          }
        }
        `,
      variables: {
        boardId: boardId,
        value: `${searchName} -`,
      },
    };
  }

  public static queryDataEndsWith(boardId: number, searchName: string) {
    return {
      query: `
        query ($boardId: ID!, $value: CompareValue!) {
          boards(ids: [$boardId]) {
            items_page(query_params: {rules: [{column_id: "name", compare_value: $value, operator: contains_text} ]}) {
              items {
                id
                name
                column_values {
                  column {
                    title
                  }
                  text
                }
              }
            }
          }
        }
        `,
      variables: {
        boardId: boardId,
        value: `/${searchName}`,
      },
    };
  }

  public static queryMultipleItems(
    boardId: number,
    productNames: string[]
  ): any {
    const orRules = productNames
      .map(
        (name) =>
          `{column_id: "name", compare_value: "${name}", operator: contains_text}`
      )
      .join(",");

    return {
      query: `
        query ($boardId: ID!) {
          boards(ids: [$boardId]) {
            items_page(
              limit: 100,
              query_params: {
                or: { rules: [${orRules}] }
              }
            ) {
              items {
                id
                name
                column_values {
                  column {
                    title
                  }
                  text
                }
              }
            }
          }
        }
      `,
      variables: {
        boardId,
      },
    };
  }

  public static auth(token: string) {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "API-Version": "2023-07",
    };
  }
}
