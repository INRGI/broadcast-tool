import { Provider } from "@nestjs/common";
import { GetAllDomainsDataTaskScheduler } from "./task-scheduler/get-all-domains-data.task-scheduler";
import { GetAllProductsDataTaskScheduler } from "./task-scheduler/get-all-products-data.task-scheduler";
import { GetDomainStatusesTaskScheduler } from "./task-scheduler/get-domain-statuses.task-scheduler";
import { GetProductStatusesTaskScheduler } from "./task-scheduler/get-product-statuses.task-scheduler";

export const taskSchedulerProviders: Provider[] = [
  GetAllDomainsDataTaskScheduler,
  GetAllProductsDataTaskScheduler,
  GetDomainStatusesTaskScheduler,
  GetProductStatusesTaskScheduler,
];
