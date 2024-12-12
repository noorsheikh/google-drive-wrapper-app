import { Auth, google } from "googleapis";

const googleOAuthClient = (accessToken: string): Auth.OAuth2Client => {
  try {
    const oauth2Client = new google.auth.OAuth2();
    if (accessToken && typeof accessToken === "string") {
      oauth2Client.setCredentials({
        access_token: accessToken,
      });
    }

    return oauth2Client;
  } catch (error) {
    throw new Error(`Error setting google oauth client, ERROR: ${error}`);
  }
};

export default googleOAuthClient;
