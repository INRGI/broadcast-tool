import { Inject } from "@nestjs/common";
import { LookerStudioApiTokens } from "../looker-studio-api.tokens";

export const InjectLookerStudioApiService = (): ReturnType<typeof Inject> =>
  Inject(LookerStudioApiTokens.LookerStudioApiService);
