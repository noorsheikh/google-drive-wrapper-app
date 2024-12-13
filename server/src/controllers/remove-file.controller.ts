import { Request, Response } from "express";
import googleOAuthClient from "../services/google-drive/google-drive.auth";
import GoogleDriveService from "../services/google-drive/google-drive.service";

const removeFile = async (req: Request, res: Response) => {
  const { access_token = "", file_id: fileId = "" } = req?.query;

  try {
    const oauth2Client = googleOAuthClient(access_token as string);
    if (!oauth2Client) {
      res.status(400).send("Invalid access token parameter provided.");
    }

    if (fileId && typeof fileId === "string") {
      const googleDriveService = new GoogleDriveService(oauth2Client);
      const fileRemoved = await googleDriveService.removeFile(fileId);
      if (fileRemoved) {
        res.status(200).send("File deleted successfully");
      } else {
        res.status(400).send("Error removing file");
      }
    } else {
      res.status(400).send("Invalid file id");
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

export default removeFile;
