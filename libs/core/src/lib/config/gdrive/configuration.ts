import { registerAs } from '@nestjs/config';

export default registerAs('gdrive', () => ({
  clientEmail: process.env.GDRIVE_CLIENT_EMAIL,
  privateKey: process.env.GDRIVE_PRIVATE_KEY,
}));
