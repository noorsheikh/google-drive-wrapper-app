import { Auth, drive_v2, google } from "googleapis";
import File from "../../models/file.model";

interface GoogleDrive {
  files(accessToken: string): Promise<File[] | undefined>;
}

export default class GoogleDriveService implements GoogleDrive {
  private googleDrive: drive_v2.Drive;

  constructor(googleOAuthClient: Auth.OAuth2Client) {
    this.googleDrive = google.drive({ version: "v2", auth: googleOAuthClient });
  }

  async files(): Promise<File[] | undefined> {
    try {
      const response = await this.googleDrive.files.list();
      const items: File[] | undefined = response?.data?.items?.map(
        ({
          id,
          title,
          thumbnailLink,
          iconLink,
          fileExtension,
          createdDate,
          modifiedDate,
          webContentLink,
          exportLinks,
          alternateLink,
        }) => {
          return {
            id,
            title,
            thumbnailLink,
            iconLink,
            fileExtension,
            createdDate,
            modifiedDate,
            webContentLink,
            exportLinks,
            alternateLink,
          } as unknown as File;
        }
      );
      // Sort files by createdDate to show the latest files at top.
      items?.sort(
        (a, b) =>
          new Date(b?.createdDate ?? "").getTime() -
          new Date(a?.createdDate ?? "").getTime()
      );

      return items;
    } catch (error) {
      throw error;
    }
  }
}
