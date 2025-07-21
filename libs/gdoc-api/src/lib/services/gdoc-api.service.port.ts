export interface GDocApiServicePort {
  getDocumentPlainText(documentId: string): Promise<string>;
}
