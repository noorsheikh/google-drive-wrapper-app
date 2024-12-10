import { useContext } from "react";
import "./App.css";
import { getInitialsForName } from "./core/auth/utils";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import { Unlock } from "lucide-react";
import Login from "./core/auth/pages/login";
import { AuthContext } from "./core/auth/context";
import Files from "./features/pages/files";

function App() {
  const { isLoggedIn, currentUser, logout } = useContext(AuthContext);

  return isLoggedIn ? (
    <>
      <div className="container mx-auto p-2 items-center bg-slate-50 flex flex-row justify-between">
        <h1>Google Drive Wrapper</h1>
        <div className="flex flex-row items-center gap-3">
          <Avatar>
            <AvatarFallback>
              {getInitialsForName(currentUser?.name ?? "")}
            </AvatarFallback>
          </Avatar>
          <p>{currentUser?.name}</p>
          <Unlock color="red" size={22} onClick={logout} />
        </div>
      </div>
      <Files />
    </>
  ) : (
    <Login />
  );
}

export default App;
