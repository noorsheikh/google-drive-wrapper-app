import { serverBaseUrl } from "@/config";
import { File } from "../../models/File";

const getAllFiles = async (
  accessToken: string
): Promise<File[] | undefined> => {
  try {
    const response = await fetch(
      `${serverBaseUrl}/allfiles?access_token=${accessToken}`
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching files from google drive, ERROR: ", error);
    return;
  }
};

export default getAllFiles;
