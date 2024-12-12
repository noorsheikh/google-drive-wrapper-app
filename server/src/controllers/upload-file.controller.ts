import { Request, Response } from "express";

import googleOAuthClient from "../services/google-drive/google-drive.auth";
import GoogleDriveService from "../services/google-drive/google-drive.service";

const uploadFile = async (req: Request, res: Response) => {
  if (!req?.file) {
    res.status(400).send("No file provided.");
  }

  try {
    const { access_token = "" } = req?.query;

    const oauth2Client = googleOAuthClient(access_token as string);
    if (!oauth2Client) {
      res.status(400).send("Invalid access token parameter provided.");
    }

    if (req?.file?.path) {
      const googleDriveService = new GoogleDriveService(oauth2Client);
      const file = await googleDriveService.uploadFile(req?.file);
      res.status(200).json(file);
    } else {
      res.status(400).send("File content not found.");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export default uploadFile;
