import { useAuth } from "react-oidc-context";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/dashboard");
      return;
    }

    const params = new URLSearchParams(location.search);
    const hasAuthCode = params.has("code");

    if (!hasAuthCode) {
      auth.signinRedirect();
    } else {
      navigate("/"); // Send user home if they came from AWS login page
    }
  }, [auth.isAuthenticated, auth.signinRedirect, location.search, navigate]);

  return <div>Redirecting to login...</div>;
};

export default LoginPage;
