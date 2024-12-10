import { serverBaseUrl } from "@/config";

const removeFile = async (
  accessToken: string,
  fileId: string
): Promise<boolean> => {
  try {
    const response = await fetch(
      `${serverBaseUrl}/remove-file?access_token=${accessToken}&file_id=${fileId}`
    );
    return response.status === 200 && response.ok;
  } catch (error) {
    console.error("Error removing file from google drive, ERROR: ", error);
    return false;
  }
};

export default removeFile;
