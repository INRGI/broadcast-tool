import { google, docs_v1 } from 'googleapis';
import { Inject, Injectable } from '@nestjs/common';
import { GDocApiTokens } from '../gdoc-api.tokens';
import { GDocApiConnectionOptions } from '../interfaces';
import { GDocApiServicePort } from './gdoc-api.service.port';

@Injectable()
export class GDocApiService implements GDocApiServicePort {
  constructor(
    @Inject(GDocApiTokens.GDocApiModuleOptions)
    private readonly options: GDocApiConnectionOptions
  ) {}

  public async getDocumentPlainText(documentId: string): Promise<string> {
    const docsApi = await this.createDocsClient();

    const response = await docsApi.documents.get({
      documentId,
    });

    const body = response.data.body?.content || [];

    const lines: string[] = [];

    for (const element of body) {
      const paragraph = element.paragraph;
      if (!paragraph) continue;

      const line = paragraph.elements
        ?.map(el => el.textRun?.content || '')
        .join('')
        .trim();

      if (line) {
        lines.push(line);
      }
    }

    return lines.join('\n');
  }

  private async createDocsClient(): Promise<docs_v1.Docs> {
    const jwtAuth = new google.auth.JWT(
      this.options.client_email,
      undefined,
      this.options.private_key,
      ['https://www.googleapis.com/auth/documents.readonly']
    );

    return google.docs({ version: 'v1', auth: jwtAuth });
  }
}
