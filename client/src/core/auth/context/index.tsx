import { createContext, ReactNode, useState } from "react";
import CurrentUser from "../models/CurrentUser";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import currentUserInfo from "../services/currentUser";
import { scopes } from "../utils";

interface AuthContextType {
  isLoggedIn: boolean;
  accessToken: string | undefined;
  currentUser: CurrentUser | undefined;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  accessToken: undefined,
  currentUser: undefined,
  login: () => {},
  logout: () => {},
});

const AuthContextProvder = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<CurrentUser | undefined>(
    undefined
  );

  const login = useGoogleLogin({
    onSuccess: async (
      response: Omit<TokenResponse, "error" | "error_description" | "error_uri">
    ) => {
      setIsLoggedIn(true);
      setAccessToken(response.access_token);
      setCurrentUser(await currentUserInfo(response.access_token));
    },
    onError: (error) => console.error("Login Failed:", error),
    scope: scopes.join(" "),
  });

  const logout = () => {
    setCurrentUser(undefined);
    setAccessToken(undefined);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, accessToken, currentUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvder;
