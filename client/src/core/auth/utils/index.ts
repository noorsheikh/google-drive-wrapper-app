import { jwtDecode } from "jwt-decode";
import CurrentUser from "../models/CurrentUser";

export const extractCurrentUserInfoFromToken = (
  token: string
): CurrentUser | undefined => {
  try {
    const data = jwtDecode(token);
    return {
      name: data.name ?? "",
      email: data?.email ?? "",
    };
  } catch (error) {
    console.error(
      "Error extracting current user info from token, ERROR: ",
      error
    );
    return;
  }
};

export const getInitialsForName = (name: string) =>
  name
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

export const scopes = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/drive",
];
