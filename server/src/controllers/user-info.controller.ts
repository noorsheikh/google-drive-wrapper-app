import { Request, Response } from "express";
import { google } from "googleapis";

import User from "../models/user.model";

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
    const userInfo = { name, email } as User;
    res.status(200).json(userInfo);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
