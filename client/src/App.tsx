import { useEffect, useState } from "react";
import "./App.css";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { setItem, getItem, removeItem } from "@/core/storage/localStorage";
import CurrentUser from "./core/auth/models/CurrentUser";
import {
  extractCurrentUserInfoFromToken,
  getInitialsForName,
} from "./core/auth/utils";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import { Unlock } from "lucide-react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [_, setLoginFailed] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | undefined>();

  useEffect(() => {
    const accessToken = getItem("accessToken");
    if (accessToken) {
      setIsLoggedIn(true);
      setCurrentUser(extractCurrentUserInfoFromToken(accessToken));
    }
  }, [isLoggedIn]);

  const onSuccess = (response: CredentialResponse) => {
    if (response.credential) {
      setIsLoggedIn(true);
      setItem("accessToken", response.credential);
    }
  };

  const onError = () => {
    setIsLoggedIn(false);
    setLoginFailed(true);
    removeItem("accessToken");
  };

  const onLogout = () => {
    setCurrentUser(undefined);
    removeItem("accessToken");
    setIsLoggedIn(false);
  };

  return isLoggedIn ? (
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
  ) : (
    <div className="container mx-auto place-items-center py-32 text-center">
      <GoogleLogin onSuccess={onSuccess} onError={onError} />
    </div>
  );
}

export default App;
