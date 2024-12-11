import { Request, Response } from "express";
import { google } from "googleapis";
import fs from "fs";

const uploadFile = async (req: Request, res: Response) => {
  if (!req?.file) {
    res.status(400).send("No file provided.");
  }

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
      res.status(200).json({
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
      });
    } else {
      res.status(400).send("File content not found.");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export default uploadFile;
