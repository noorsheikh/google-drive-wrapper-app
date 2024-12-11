import { Request, Response } from "express";
import { google } from "googleapis";

export const listFiles = async (req: Request, res: Response) => {
  const { access_token = "" } = req?.query;

  const oauth2Client = new google.auth.OAuth2();
  if (access_token && typeof access_token === "string") {
    oauth2Client.setCredentials({
      access_token,
    });
  } else {
    res.status(400).send("Invalid access token parameter provided.");
  }

  try {
    const drive = google.drive({ version: "v2", auth: oauth2Client });
    const response = await drive.files.list();
    const items = response?.data?.items?.map(
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
      }) => ({
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
      })
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
