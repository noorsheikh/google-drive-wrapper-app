import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { File } from "../models/File";
import { AuthContext } from "@/core/auth/context";
import getAllFiles from "../services/getAllFiles";
import removeFile from "../services/removeFile";

interface DriveContextType {
  files: File[] | undefined;
  addFile: (file: File) => void;
  removeFile: (fileId: string) => void;
}

export const DriveContext = createContext<DriveContextType>({
  files: undefined,
  addFile: (file: File) => file,
  removeFile: (fileId: string) => fileId,
});

const DriveContextProvider = ({ children }: { children: ReactNode }) => {
  const { accessToken } = useContext(AuthContext);
  const [files, setFiles] = useState<File[] | undefined>();

  useEffect(() => {
    const fetchFiles = async () => {
      setFiles(await getAllFiles(accessToken));
    };
    fetchFiles();
  }, [accessToken]);

  const add = (file: File) => {
    if (files) {
      setFiles([file, ...files]);
    } else {
      setFiles([file]);
    }
  };

  const remove = async (fileId: string) => {
    const fileRemoved = await removeFile(accessToken, fileId);
    if (fileRemoved) {
      setFiles(files?.filter((file) => file?.id !== fileId));
    }
  };

  return (
    <DriveContext.Provider value={{ files, addFile: add, removeFile: remove }}>
      {children}
    </DriveContext.Provider>
  );
};

export default DriveContextProvider;
