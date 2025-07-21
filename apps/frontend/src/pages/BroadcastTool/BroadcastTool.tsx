import { useEffect, useState } from "react";
import {
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";
import Menu from "../../components/BroadcastTool/Menu";
import { AuthWrapper, Container, Title } from "./BroadcastTool.styled";
import { toastError } from "../../helpers/toastify";
import { googleAuth } from "../../api/auth.api";
import WalkingCat from "../../components/Common/WalkingCat";

const BroadcastTool: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("broadcast_user");
    if (stored) {
      setIsAuthorized(true);
    }
  }, []);

  const handleLoginSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;
      const res = await googleAuth(idToken);

      localStorage.setItem("broadcast_user", JSON.stringify(res));
      setIsAuthorized(true);
    } catch (err) {
      toastError("Failed to login");
    }
  };

  return (
    <GoogleOAuthProvider clientId={'1042942150757-2q0dlbnb2ti5dhu68nf8bia7eusuj795.apps.googleusercontent.com'}>
      <Container>
        {!isAuthorized ? (
          <AuthWrapper>
            <Title>Login to access Broadcast Tool</Title>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => alert("Login failed")}
              theme="filled_black"
              width="100%"
              size="large"
              ux_mode="popup"
            />
          </AuthWrapper>
        ) : (
          <Menu />
        )}
      </Container>
      <WalkingCat />
    </GoogleOAuthProvider>
  );
};

export default BroadcastTool;
