export interface File {
  id: string;
  title: string;
  thumbnailLink: string;
  iconLink: string;
  createdDate: string;
  modifiedDate: string;
  fileExtension: string;
  webContentLink?: string;
  exportLinks?: { [key: string]: string };
  alternateLink?: string;
}
