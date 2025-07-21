import { Provider } from "@nestjs/common";
import { GetAllPriorityProductsService } from "./services/get-all-priority-products/get-all-priority-products.service";

export const messageControllers = [];

export const applicationProviders: Provider[] = [];

export const serviceProviders: Provider[] = [GetAllPriorityProductsService];
