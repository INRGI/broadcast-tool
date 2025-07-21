import { useEffect, useState } from "react";
import { Container, Title, AuthWrapper } from "./AdminBroadcastTool.styled";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { toastError } from "../../helpers/toastify";
import { jwtDecode } from "jwt-decode";
import { checkIfAdmin } from "../../api/auth.api";
import AdminMenu from "../../components/BroadcastTool/AdminMenu";

const TOKEN_KEY = "admin_jwt_token";

const AdminBroadcastTool: React.FC = () => {
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useEffect(() => {
    document.title = "Admin Broadcast Tool";
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const isExpired = Date.now() >= decoded.exp * 1000;
        if (!isExpired) setIsUserAdmin(true);
        else localStorage.removeItem(TOKEN_KEY);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  }, []);

  const handleCheckIfAdmin = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;
      const res = await checkIfAdmin(idToken);

      if (!res.token) {
        return toastError("You are not authorized to access this panel");
      }

      localStorage.setItem(TOKEN_KEY, res.token);
      setIsUserAdmin(true);
    } catch (err) {
      toastError("You are not authorized to access this panel");
    }
  };

  return (
    <GoogleOAuthProvider clientId="1042942150757-2q0dlbnb2ti5dhu68nf8bia7eusuj795.apps.googleusercontent.com">
      <Container>
        {!isUserAdmin ? (
          <AuthWrapper>
            <Title>Login to access Admin Panel</Title>
            <GoogleLogin
              onSuccess={handleCheckIfAdmin}
              onError={() => toastError("Login failed")}
              theme="filled_black"
              width="100%"
              size="large"
              ux_mode="popup"
            />
          </AuthWrapper>
        ) : (
          <AdminMenu />
        )}
      </Container>
    </GoogleOAuthProvider>
  );
};

export default AdminBroadcastTool;
