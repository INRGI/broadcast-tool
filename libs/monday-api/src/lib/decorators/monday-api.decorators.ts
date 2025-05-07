import { Inject } from '@nestjs/common';
import { MondayApiTokens } from '../monday-api.tokens';

export const InjectMondayApiService = (): ReturnType<typeof Inject> =>
  Inject(MondayApiTokens.MondayApiService);
