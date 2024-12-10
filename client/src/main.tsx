import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { googleClientId } from "@/config";
import AuthContextProvder from "./core/auth/context/index.tsx";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={googleClientId}>
    <BrowserRouter>
      <AuthContextProvder>
        <App />
      </AuthContextProvder>
    </BrowserRouter>
  </GoogleOAuthProvider>
);
