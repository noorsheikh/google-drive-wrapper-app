import { Request, Response } from "express";
import { google } from "googleapis";

export const userInfo = async (req: Request, res: Response) => {
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
};
