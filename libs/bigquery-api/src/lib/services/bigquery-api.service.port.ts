import {
  BigQueryApiServiceGetDatasetDataByQueryRequest,
  BigQueryRow,
} from '../interfaces';

export interface BigQueryApiServicePort {
  getDatasetDataByQuery(
    data: BigQueryApiServiceGetDatasetDataByQueryRequest
  ): Promise<BigQueryRow[]>;
}
