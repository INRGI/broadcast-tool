import { HttpModuleOptions } from "@nestjs/axios";

export interface StatisticApiModuleOptions extends HttpModuleOptions {
  accessToken: string;
}
