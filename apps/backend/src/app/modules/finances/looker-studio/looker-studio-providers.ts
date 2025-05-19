import { Provider } from "@nestjs/common";
import { LookerStudioController } from "./controllers/looker-studio.controller";

export const messageControllers = [LookerStudioController];

export const applicationProviders: Provider[] = [];

export const serviceProviders: Provider[] = [];
