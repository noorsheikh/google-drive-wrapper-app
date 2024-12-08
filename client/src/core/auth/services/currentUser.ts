import { googleApisBaseUrl } from "@/config";
import CurrentUser from "@/core/auth/models/CurrentUser";

export const getCurrentUserInfo = async (
  accessToken: string
): Promise<CurrentUser | undefined> => {
  console.log(accessToken);
  try {
    const response = await fetch(`${googleApisBaseUrl}/oauth2/v2/userinfo`, {
      method: "GET",
      mode: "no-cors",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    console.log(response);

    if (!response.ok) {
      console.error("Failed to fetch current user info.");
      return;
    }

    const user = await response?.json();
    return {
      displayName: user.displayName,
      photoUrl: user.photoUrl,
    };
  } catch (error) {
    console.error("Error retrieving current user info, ERROR: ", error);
    return;
  }
};
