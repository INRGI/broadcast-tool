import { Provider } from "@nestjs/common";
import { GetProductDataService } from "./services/get-product-data/get-product-data.service";
import { MondayController } from "./controllers/monday.controller";
import { GetDomainDataService } from "./services/get-domain-data/get-domain-data.service";

export const messageControllers = [MondayController];

export const applicationProviders: Provider[] = [];

export const serviceProviders: Provider[] = [
  GetProductDataService,
  GetDomainDataService,
];
