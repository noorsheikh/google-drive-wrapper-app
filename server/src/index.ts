import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { google } from "googleapis";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 3000;

app.get("/userinfo", async (req: Request, res: Response) => {
  const { accessToken = "" } = req?.query;

  const oauth2Client = new google.auth.OAuth2();
  if (accessToken && typeof accessToken === "string") {
    console.log("access token: ", accessToken);
    oauth2Client.setCredentials({
      access_token: accessToken,
    });
  } else {
    res.status(400).send("Invalid access token parameter provide.");
  }

  try {
    const oauth2 = google.oauth2({
      version: "v2",
      auth: oauth2Client,
    });

    const userInfoResponse = await oauth2.userinfo.get();
    res.json(userInfoResponse.data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.listen(port, () => {
  console.log(`Server address: http://localhost:${port}.`);
});
