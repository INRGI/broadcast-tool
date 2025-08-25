import { Provider } from "@nestjs/common";
import { QmToolController } from "./controllers/qm-tool.message.controller";
import { ValidateCopyService } from "./services/validate-copy/validate-copy.service";

export const messageControllers = [QmToolController];

export const applicationProviders: Provider[] = [];

export const serviceProviders: Provider[] = [ValidateCopyService];
