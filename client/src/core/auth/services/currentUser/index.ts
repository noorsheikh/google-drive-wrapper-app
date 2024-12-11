import { serverBaseUrl } from "@/config";
import CurrentUser from "../../models/CurrentUser";

const currentUserInfo = async (
  accessToken: string
): Promise<CurrentUser | undefined> => {
  try {
    const response = await fetch(
      `${serverBaseUrl}/user-info?access_token=${accessToken}`
    );

    return await response.json();
  } catch (error) {
    console.error("Error fetching current user info, ERROR: ", error);
    return;
  }
};

export default currentUserInfo;
