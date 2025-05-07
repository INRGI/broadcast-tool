import { ClassProvider } from '@nestjs/common';
import { GDriveApiTokens } from '../gdrive-api.tokens';
import { GDriveApiService } from '../services';

export const serviceProviders: ClassProvider[] = [
  {
    provide: GDriveApiTokens.GDriveApiService,
    useClass: GDriveApiService,
  },
];
