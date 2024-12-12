import { Auth, drive_v2, google } from "googleapis";
import File from "../../models/file.model";
import fs from "fs";

interface GoogleDrive {
  files(accessToken: string): Promise<File[] | undefined>;
  uploadFile(file: Express.Multer.File): Promise<File | undefined>;
  removeFile(fileId: string): Promise<boolean>;
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
      throw new Error(`Error listing files from google drive, ERROR: ${error}`);
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<File | undefined> {
    try {
      const response = await this.googleDrive.files.insert({
        media: {
          mimeType: file?.mimetype,
          body: fs.createReadStream(file.path),
        },
        requestBody: {
          title: file?.originalname,
        },
      });

      if (fs.existsSync(file.path)) {
        fs.unlink(file.path, (error) => {
          console.error("Error cleaning up file, ERROR: ", error);
        });
      }

      const {
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
      } = response?.data;
      const uploadedFile = {
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
      } as File;

      return uploadedFile;
    } catch (error) {
      throw new Error(`Error uploading file to google drive, ERROR: ${error}`);
    }
  }

  async removeFile(fileId: string): Promise<boolean> {
    try {
      await this.googleDrive.files.delete({ fileId });
      return true;
    } catch (error) {
      throw new Error(`Error removing file from google drive, ERROR: ${error}`);
    }
  }
}
