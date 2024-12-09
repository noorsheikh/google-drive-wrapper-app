import { useEffect, useState } from "react";
import "./App.css";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { setItem, getItem, removeItem } from "@/core/storage/localStorage";
import CurrentUser from "./core/auth/models/CurrentUser";
import {
  extractCurrentUserInfoFromToken,
  getInitialsForName,
  scopes,
} from "./core/auth/utils";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import { Unlock } from "lucide-react";
import { currentUserInfo } from "./core/auth/services/currentUser";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | undefined>();

  useEffect(() => {
    const accessToken = getItem("accessToken");
    if (accessToken) {
      setIsLoggedIn(true);
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
