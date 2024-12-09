export interface File {
  id: string;
  title: string;
  thumbnailLink: string;
  iconLink: string;
  fileExtension: string;
  createdData: string;
  modifiedDate: string;
  webContentLink?: string;
  exportLinks?: { [key: string]: string };
}
