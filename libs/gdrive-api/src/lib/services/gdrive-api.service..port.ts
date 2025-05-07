import { drive_v3 } from 'googleapis';

export interface GDriveApiServicePort {
  listFiles(
    pageSize: number,
    pageToken?: string
  ): Promise<drive_v3.Schema$FileList>;

  getFile(fileId: string, mimeTipe?: string): Promise<drive_v3.Schema$File>;

  getFileAsBuffer(fileId: string): Promise<Buffer>;

  getFolderContent(
    folderId: string,
    pageSize: number,
    pageToken?: string
  ): Promise<drive_v3.Schema$FileList>;

  searchFileWithQuery(
    query: string,
    pageSize: number,
    pageToken?: string,
    driveId?: string
  ): Promise<drive_v3.Schema$FileList>;

  getContentLikeBuffer(fileId: string, mimeType: string): Promise<Buffer>;
}
