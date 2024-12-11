import { serverBaseUrl } from "@/config";
import { File } from "../../models/File";

const listFiles = async (
  accessToken: string | undefined
): Promise<File[] | undefined> => {
  if (!accessToken) {
    console.error("Invalid access token");
    return;
  }

  try {
    const response = await fetch(
      `${serverBaseUrl}/list-files?access_token=${accessToken}`
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching files from google drive, ERROR: ", error);
    return;
  }
};

export default listFiles;
