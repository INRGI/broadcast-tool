import { Provider } from '@nestjs/common';
import { MondayController } from './controllers/monday.message.controller';
import { GetAllDomainsDataService } from './services/get-all-domains-data/get-all-domains-data.service';
import { GetAllProductsDataService } from './services/get-all-products-data/get-all-products-data.service';
import { GetProductStatusesService } from './services/get-product-statuses/get-product-statuses.service';
import { GetDomainStatusesService } from './services/get-domain-statuses/get-domain-statuses.service';
import { MondayConfigService } from '@epc-services/core';
import { GetNewTestCopiesService } from './services/get-new-test-copies/get-new-test-copies.service';

export const messageControllers = [MondayController];

export const applicationProviders: Provider[] = [];

export const serviceProviders: Provider[] = [
  GetAllDomainsDataService,
  GetAllProductsDataService,
  GetProductStatusesService,
  GetDomainStatusesService,
  MondayConfigService,
  GetNewTestCopiesService,
];
