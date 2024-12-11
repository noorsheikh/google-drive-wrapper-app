import app from "./app";
import { Request, Response } from "express";
import { google } from "googleapis";
import fs from "fs";
import multer from "multer";
import config from "./config";

const { PORT } = config;

const upload = multer({ dest: "uploads/" });

app.get("/userinfo", async (req: Request, res: Response) => {
  const { access_token = "" } = req?.query;

  const oauth2Client = new google.auth.OAuth2();
  if (access_token && typeof access_token === "string") {
    oauth2Client.setCredentials({
      access_token,
    });
  } else {
    res.status(400).send("Invalid access token parameter provide.");
  }

  try {
    const oauth2 = google.oauth2({
      version: "v2",
      auth: oauth2Client,
    });

    const response = await oauth2.userinfo.get();
    const { name, email } = response.data;
    res.status(200).json({ name, email });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

app.get("/allfiles", async (req: Request, res: Response) => {
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
});

app.get("/remove-file", async (req: Request, res: Response) => {
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
});

app.post(
  "/upload-file",
  upload.single("file"),
  async (req: Request, res: Response) => {
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
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
