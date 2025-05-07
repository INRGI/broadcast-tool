import { Inject } from '@nestjs/common';
import { GDriveApiTokens } from '../gdrive-api.tokens';

export const InjectGDriveApiService = (): ReturnType<typeof Inject> =>
  Inject(GDriveApiTokens.GDriveApiService);
