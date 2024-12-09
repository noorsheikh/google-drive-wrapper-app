import { useEffect, useState } from "react";
import "./App.css";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { setItem, getItem, removeItem } from "@/core/storage/localStorage";
import CurrentUser from "./core/auth/models/CurrentUser";
import { getInitialsForName, scopes } from "./core/auth/utils";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import { DownloadIcon, Trash2Icon, Unlock } from "lucide-react";
import currentUserInfo from "./core/auth/services/currentUser";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import getAllFiles from "./core/googleDrive/services/getAllFiles";
import { File } from "./core/googleDrive/models/File";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | undefined>();
  const [files, setFiles] = useState<File[] | undefined>();

  useEffect(() => {
    const accessToken = getItem("accessToken");
    if (accessToken) {
      setIsLoggedIn(true);
      getFiles(accessToken);
    }
    if (getItem("currentUser")) {
      setCurrentUser(JSON.parse(getItem("currentUser")));
    }
  }, [isLoggedIn]);

  const onLogout = () => {
    setCurrentUser(undefined);
    removeItem("accessToken");
    removeItem("currentUser");
    setIsLoggedIn(false);
  };

  const login = useGoogleLogin({
    onSuccess: async (
      response: Omit<TokenResponse, "error" | "error_description" | "error_uri">
    ) => {
      setIsLoggedIn(true);
      setItem("accessToken", response.access_token);
      setCurrentUser(await currentUserInfo(response.access_token));
    },
    onError: (error) => console.log("Login Failed:", error),
    scope: scopes.join(" "),
  });

  const getFiles = async (accessToken: string) => {
    setFiles(await getAllFiles(accessToken));
  };

  return isLoggedIn ? (
    <>
      <div className="container mx-auto p-4 bg-slate-50 flex flex-row justify-between">
        <h1>Google Drive Wrapper</h1>
        <div className="flex flex-row items-center gap-3">
          <Avatar>
            <AvatarFallback>
              {getInitialsForName(currentUser?.name ?? "")}
            </AvatarFallback>
          </Avatar>
          <p>{currentUser?.name}</p>
          <Unlock color="red" size={24} onClick={onLogout} />
        </div>
      </div>
      <div className="container mx-auto place-items-center text-center py-2">
        <div className="flex flex-col items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            All files in Google Drive
          </h2>
          <p className="text-muted-foreground">
            Here's a list of your tasks for this month!
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableHead>Title</TableHead>
            <TableHead>File Type</TableHead>
            <TableHead>Creation Date</TableHead>
            <TableHead>Last Modified Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableHeader>
          <TableBody>
            {files?.map((file, index) => (
              <TableRow key={index} className="text-left">
                <TableCell>{file.title}</TableCell>
                <TableCell>{file.fileExtension}</TableCell>
                <TableCell>{file.createdDate}</TableCell>
                <TableCell>{file.modifiedDate}</TableCell>
                <TableCell>
                  <span className="flex flex-row gap-2">
                    <DownloadIcon
                      className="cursor-pointer"
                      color="green"
                      size={18}
                    />
                    <Trash2Icon
                      className="cursor-pointer"
                      color="red"
                      size={18}
                    />
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  ) : (
    <div className="container mx-auto place-items-center py-32 text-center">
      <button
        className="px-4 py-2 border rounded-sm flex flex-row gap-2 items-center"
        onClick={() => login()}
      >
        <img
          src="https://cdn.brandfetch.io/id6O2oGzv-/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B"
          height={20}
          width={20}
        />
        <p>Sign in with Google</p>
      </button>
    </div>
  );
}

export default App;
