import { registerAs } from "@nestjs/config";

export default registerAs("statistic", () => ({
  projectId: process.env.BIGQUERY_PROJECT_ID,
  clientEmail: process.env.BIGQUERY_CLIENT_EMAIL,
  privateKey: process.env.BIGQUERY_PRIVATE_KEY,
}));
