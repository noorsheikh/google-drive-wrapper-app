import { useEffect, useState } from "react";
import "./App.css";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { setItem, getItem, removeItem } from "@/core/storage/localStorage";
import CurrentUser from "./core/auth/models/CurrentUser";
import { getCurrentUserInfo } from "./core/auth/services/currentUser";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [_, setLoginFailed] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | undefined>();

  useEffect(() => {
    const accessToken = getItem("accessToken");
    const fetchCurrentUserInfo = async (token: string) => {
      setCurrentUser(await getCurrentUserInfo(token));
    };
    if (accessToken) {
      setIsLoggedIn(true);
      fetchCurrentUserInfo(accessToken);
    }
  }, [isLoggedIn, currentUser]);

  const onSuccess = (response: CredentialResponse): void => {
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

  return isLoggedIn ? (
    <div className="container mx-auto p-4 bg-slate-50">
      <h1>Google Drive Wrapper</h1>
      <h1>Welcome {currentUser?.displayName}</h1>
    </div>
  ) : (
    <div className="container mx-auto place-items-center py-32 text-center">
      <GoogleLogin onSuccess={onSuccess} onError={onError} />
    </div>
  );
}

export default App;
