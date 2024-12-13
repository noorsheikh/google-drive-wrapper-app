import { Request, Response } from "express";

import googleOAuthClient from "../services/google-drive/google-drive.auth";
import GoogleDriveService from "../services/google-drive/google-drive.service";

export const listFiles = async (req: Request, res: Response) => {
  try {
    const { access_token = "" } = req?.query;

    const oauth2Client = googleOAuthClient(access_token as string);
    if (!oauth2Client) {
      res.status(400).send("Invalid access token parameter provided.");
    }

    const googleDriveService = new GoogleDriveService(oauth2Client);
    const files = await googleDriveService.files();
    res.status(200).json(files);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};

export default listFiles;
