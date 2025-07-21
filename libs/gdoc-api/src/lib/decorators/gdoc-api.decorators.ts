import { Inject } from '@nestjs/common';
import { GDocApiTokens } from '../gdoc-api.tokens';

export const InjectGDocApiService = (): ReturnType<typeof Inject> =>
  Inject(GDocApiTokens.GDocApiService);
