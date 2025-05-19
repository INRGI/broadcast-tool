import { HttpModuleOptions } from "@nestjs/axios";

export interface LookerStudioApiModuleOptions extends HttpModuleOptions {
  accessToken: string;
}
