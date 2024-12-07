import { useState } from "react";
import "./App.css";
import { GoogleLogin } from "@react-oauth/google";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return isLoggedIn ? (
    <h1>logged in</h1>
  ) : (
    <div className="container mx-auto place-items-center py-32 text-center">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
          setIsLoggedIn(true);
        }}
        onError={() => {
          console.log("login failed!");
        }}
      />
    </div>
  );
}

export default App;
