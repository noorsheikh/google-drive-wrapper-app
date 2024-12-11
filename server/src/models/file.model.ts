export default interface File {
  id: string;
  title: string;
  thumbnailLink: string;
  iconLink: string;
  fileExtension: string;
  createdDate: string;
  modifiedDate: string;
  webContentLink?: string;
  exportLinks?: { [key: string]: string };
  alternateLink?: string;
}
