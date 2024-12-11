import { serverBaseUrl } from "@/config";
import { File } from "../../models/File";

const uploadFile = async (
  accessToken: string | undefined,
  file: Blob | undefined
): Promise<File | undefined> => {
  try {
    if (!(accessToken || file)) {
      console.log("Missing parameter");
      return;
    }

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }

    const response = await fetch(
      `${serverBaseUrl}/upload-file?access_token=${accessToken}`,
      {
        method: "POST",
        body: formData,
      }
    );
    return response.json();
  } catch (error) {
    console.error("Error uploading file to google drive, ERROR: ", error);
    return;
  }
};

export default uploadFile;
