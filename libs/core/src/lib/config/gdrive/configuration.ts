import { registerAs } from '@nestjs/config';

export default registerAs('gdrive', () => ({
  clientEmail: process.env.GDRIVE_CLIENT_EMAIL,
  privateKey: process.env.GDRIVE_PRIVATE_KEY,
  healthClientEmail: process.env.HEALTH_GDRIVE_CLIENT_EMAIL,
  healthPrivateKey: process.env.HEALTH_GDRIVE_PRIVATE_KEY,
  ogPrivateKey: process.env.OG_GDRIVE_PRIVATE_KEY,
  ogClientEmail: process.env.OG_GDRIVE_CLIENT_EMAIL,
}));
