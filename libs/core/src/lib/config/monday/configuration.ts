import { registerAs } from '@nestjs/config';

export default registerAs('monday', () => ({
  accessToken: process.env.MONDAY_ACCESS_TOKEN,
  productsBoardId: process.env.MONDAY_PRODUCTS_BOARD_ID,
  domainsBoardId: process.env.MONDAY_DOMAINS_BOARD_ID,
  ogAccessToken: process.env.OG_MONDAY_ACCESS_TOKEN,
  ogProductsBoardId: process.env.OG_MONDAY_PRODUCTS_BOARD_ID,
  ogDomainsBoardId: process.env.OG_MONDAY_DOMAINS_BOARD_ID,
  testCopiesBoardId: process.env.MONDAY_DEV_COPIES_BOARD_ID,
}));
