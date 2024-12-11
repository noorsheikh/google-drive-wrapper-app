import { Request, Response } from "express";
import { google } from "googleapis";

import File from "../models/file.model";
import googleOAuthClient from "../services/google-drive/google-drive.auth";

export const listFiles = async (req: Request, res: Response) => {
  const { access_token = "" } = req?.query;

  const oauth2Client = googleOAuthClient(access_token as string);
  if (oauth2Client) {
    res.status(400).send("Invalid access token parameter provided.");
  }

  try {
    const drive = google.drive({ version: "v2", auth: oauth2Client });
    const response = await drive.files.list();
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
    res.status(200).json(items);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export default listFiles;
