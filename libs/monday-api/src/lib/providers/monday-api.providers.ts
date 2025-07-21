import { ClassProvider } from '@nestjs/common';
import { MondayApiTokens } from '../monday-api.tokens';
import { MondayApiService } from '../services';

export const serviceProviders: ClassProvider[] = [
  {
    provide: MondayApiTokens.MondayApiService,
    useClass: MondayApiService,
  },
];
