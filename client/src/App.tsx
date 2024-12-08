import { useEffect, useState } from "react";
import "./App.css";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { setItem, getItem, removeItem } from "@/core/storage/localStorage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [_, setLoginFailed] = useState<boolean>(false);

  useEffect(() => {
    const accessToken = getItem("accessToken");
    if (accessToken) {
      setIsLoggedIn(true);
    }
  }, []);

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
    <h1>logged in</h1>
  ) : (
    <div className="container mx-auto place-items-center py-32 text-center">
      <GoogleLogin onSuccess={onSuccess} onError={onError} />
    </div>
  );
}

export default App;
