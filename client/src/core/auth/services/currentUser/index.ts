import { serverBaseUrl } from "@/config";
import CurrentUser from "../../models/CurrentUser";
import { getItem, setItem } from "@/core/storage/localStorage";

export const currentUserInfo = async (
  accessToken: string
): Promise<CurrentUser | undefined> => {
  try {
    if (!getItem("currentUser")) {
      const response = await fetch(
        `${serverBaseUrl}/userinfo?access_token=${accessToken}`
      );
      const { name = "", email = "" } = await response.json();
      const currentUser = { name, email };
      setItem("currentUser", JSON.stringify(currentUser));
      return currentUser;
    }
  } catch (error) {
    console.error("Error fetching current user info, ERROR: ", error);
    return;
  }
};
