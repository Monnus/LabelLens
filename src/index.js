import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Amplify } from "aws-amplify";
import amplifyconfig from "./amplifyconfiguration.json";
import { AuthProvider } from "react-oidc-context"; // ✅ Moved this import to the top

// Configure Amplify
Amplify.configure(amplifyconfig);

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_15rmVRJ6C",
  client_id: "4488b559kpbreinm4uvanfec8k",
  redirect_uri: "http://localhost:3000",
  response_type: "code",
  scope: "openid",
};

const root = ReactDOM.createRoot(document.getElementById("root"));

// Wrap the application with AuthProvider
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
reportWebVitals();
