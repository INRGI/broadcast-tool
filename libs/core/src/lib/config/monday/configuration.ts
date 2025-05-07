import { registerAs } from '@nestjs/config';

export default registerAs('monday', () => ({
  accessToken: process.env.MONDAY_ACCESS_TOKEN,
}));
