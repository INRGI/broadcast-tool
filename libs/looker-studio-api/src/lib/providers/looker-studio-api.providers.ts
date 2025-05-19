import { ClassProvider } from "@nestjs/common";
import { LookerStudioApiTokens } from "../looker-studio-api.tokens";
import { LookerStudioApiService } from "../services";

export const serviceProviders: ClassProvider[] = [
  {
    provide: LookerStudioApiTokens.LookerStudioApiService,
    useClass: LookerStudioApiService,
  },
];
