import { Request, Response } from "express";
import { google } from "googleapis";

const removeFile = async (req: Request, res: Response) => {
  const { access_token = "", file_id: fileId = "" } = req?.query;

  const oauth2Client = new google.auth.OAuth2();
  if (access_token && typeof access_token === "string") {
    oauth2Client.setCredentials({
      access_token,
    });
  } else {
    res.status(400).send("Invalid access token parameter provided.");
  }

  try {
    if (fileId && typeof fileId === "string") {
      const drive = google.drive({ version: "v2", auth: oauth2Client });
      await drive.files.delete({ fileId });
      res.status(200).end("File deleted successfully");
    } else {
      res.status(400).end("Invalid file id");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export default removeFile;
