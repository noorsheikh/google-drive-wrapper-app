import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { google } from "googleapis";
import cors from "cors";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

const port = 3000;

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
    res.status(400).send("Invalid access token parameter provide.");
  }

  try {
    const drive = google.drive({ version: "v2", auth: oauth2Client });
    const response = await drive.files.list();
    const items = response?.data?.items?.map(
      ({
        title,
        thumbnailLink,
        iconLink,
        fileExtension,
        createdDate,
        modifiedDate,
      }) => ({
        title,
        thumbnailLink,
        iconLink,
        fileExtension,
        createdDate,
        modifiedDate,
      })
    );
    res.status(200).json(items);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server address: http://localhost:${port}.`);
});