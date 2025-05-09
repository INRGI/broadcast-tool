import { Provider } from "@nestjs/common";
import { GetAllDomainsService } from "./services/get-all-domains/get-all-domains.service";
import { BroadcastController } from "./controllers/broadcast.controller";

export const messageControllers = [BroadcastController];

export const applicationProviders: Provider[] = [];

export const serviceProviders: Provider[] = [GetAllDomainsService];
