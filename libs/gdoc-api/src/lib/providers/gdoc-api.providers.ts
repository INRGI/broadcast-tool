import { ClassProvider } from '@nestjs/common';
import { GDocApiService } from '../services';
import { GDocApiTokens } from '../gdoc-api.tokens';

export const serviceProviders: ClassProvider[] = [
  {
    provide: GDocApiTokens.GDocApiService,
    useClass: GDocApiService,
  },
];
