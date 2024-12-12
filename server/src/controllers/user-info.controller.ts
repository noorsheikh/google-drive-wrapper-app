import { Request, Response } from "express";
import { google } from "googleapis";

import User from "../models/user.model";
import googleOAuthClient from "../services/google-drive/google-drive.auth";

export const userInfo = async (req: Request, res: Response) => {
  try {
    const { access_token = "" } = req?.query;

    const oauth2Client = googleOAuthClient(access_token as string);
    if (!oauth2Client) {
      res.status(400).send("Invalid access token parameter provide.");
    }

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
