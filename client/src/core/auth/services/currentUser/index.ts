import { serverBaseUrl } from "@/config";
import CurrentUser from "../../models/CurrentUser";
import { getItem, setItem } from "@/core/storage/localStorage";

const currentUserInfo = async (
  accessToken: string
): Promise<CurrentUser | undefined> => {
  try {
    const response = await fetch(
      `${serverBaseUrl}/userinfo?access_token=${accessToken}`
    );
    const currentUser = await response.json();
    setItem("currentUser", JSON.stringify(currentUser));
    return currentUser;
  } catch (error) {
    console.error("Error fetching current user info, ERROR: ", error);
    return;
  }
};

export default currentUserInfo;
