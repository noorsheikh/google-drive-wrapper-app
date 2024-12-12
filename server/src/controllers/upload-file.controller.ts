import { Request, Response } from "express";
import { google } from "googleapis";
import fs from "fs";

import File from "../models/file.model";
import googleOAuthClient from "../services/google-drive/google-drive.auth";

const uploadFile = async (req: Request, res: Response) => {
  if (!req?.file) {
    res.status(400).send("No file provided.");
  }

  const { access_token = "" } = req?.query;

  const oauth2Client = googleOAuthClient(access_token as string);
  if (!oauth2Client) {
    res.status(400).send("Invalid access token parameter provided.");
  }

  try {
    if (req?.file?.path) {
      const drive = google.drive({ version: "v2", auth: oauth2Client });
      const response = await drive.files.insert({
        media: {
          mimeType: req?.file?.mimetype,
          body: fs.createReadStream(req.file.path),
        },
        requestBody: {
          title: req?.file?.originalname,
        },
      });
      fs.unlink(req.file.path, (error) => {
        console.error("Error cleaning up file, ERROR: ", error);
      });
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
      const file = {
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
