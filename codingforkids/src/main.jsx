import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "./context/UserContext";
import App from "./App.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
    <GoogleOAuthProvider clientId="126967444265-fqcniecevn16d16qehi9a6rvnfavik1o.apps.googleusercontent.com">
      <UserProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UserProvider>
    </GoogleOAuthProvider>
);
