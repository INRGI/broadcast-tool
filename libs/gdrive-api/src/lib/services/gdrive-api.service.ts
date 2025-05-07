import { Inject, Injectable } from "@nestjs/common";
import { drive_v3, google } from "googleapis";
import { GDriveApiServicePort } from "./gdrive-api.service..port";
import { GDriveApiConnectionOptions } from "../interfaces";
import { GDriveApiTokens } from "../gdrive-api.tokens";
import { GDRIVE_API_SCOPE_URL } from "../constants";

@Injectable()
export class GDriveApiService implements GDriveApiServicePort {
  constructor(
    @Inject(GDriveApiTokens.GDriveApiModuleOptions)
    private readonly options: GDriveApiConnectionOptions
  ) {}

  public async listFiles(
    pageSize: number,
    pageToken?: string
  ): Promise<drive_v3.Schema$FileList> {
    const client = await this.createClient();
    const { data } = await client.files.list({
      pageSize: pageSize,
      pageToken: pageToken,
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
    });
    return data;
  }

  public async getFile(
    fileId: string,
    mimeTipe?: string
  ): Promise<drive_v3.Schema$File> {
    const client = await this.createClient();
    const { data } = await client.files.get({
      fileId: fileId,
      alt: mimeTipe,
    });
    return data;
  }

  public async getFileAsBuffer(fileId: string): Promise<Buffer> {
    const client = await this.createClient();
    const response = await client.files.get(
      {
        fileId: fileId,
        alt: "media",
      },
      { responseType: "arraybuffer" }
    );

    return Buffer.from(response.data as ArrayBuffer);
  }

  public async searchFileWithQuery(
    query: string,
    pageSize: number,
    pageToken?: string,
    driveId?: string
  ): Promise<drive_v3.Schema$FileList> {
    const client = await this.createClient();
    const { data } = await client.files.list({
      q: query,
      pageSize: pageSize,
      pageToken: pageToken,
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      corpora: driveId ? "drive" : "allDrives",
      driveId: driveId,
    });
    return data;
  }

  public async getFolderContent(
    folderId: string,
    pageSize: number,
    pageToken?: string
  ): Promise<drive_v3.Schema$FileList> {
    const client = await this.createClient();
    const { data } = await client.files.list({
      q: `'${folderId}' in parents`,
      pageSize: pageSize,
      pageToken: pageToken,
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
    });
    return data;
  }

  public async getContentLikeBuffer(
    fileId: string,
    mimeType: string
  ): Promise<Buffer> {
    const client = await this.createClient();
    const response = await client.files.export(
      {
        fileId: fileId,
        mimeType,
      },
      { responseType: "arraybuffer" }
    );

    return Buffer.from(response.data as ArrayBuffer);
  }

  private async createClient(): Promise<drive_v3.Drive> {
    const jwtAuth = new google.auth.JWT(
      this.options.client_email,
      null,
      this.options.private_key,
      [GDRIVE_API_SCOPE_URL]
    );

    await jwtAuth.authorize();

    const drive: drive_v3.Drive = google.drive({
      version: "v3",
      auth: jwtAuth,
    });
    return drive;
  }
}
