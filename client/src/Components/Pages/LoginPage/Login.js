import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { login, googleLogin } from "../../../Services/userService";
import { GoogleLogin } from "@react-oauth/google";
import Background from "../../Background";
import Logo from "../../../Images/logo.svg";
import {
  BgContainer,
  Container,
  LogoIconContainer,
  FormSection,
  FormCard,
  Form,
  Title,
  Input,
  Button,
  Icon,
  Hr,
  Link,
} from "./Styled";

const Login = () => {
  let history = useHistory();
  const dispatch = useDispatch();
  const [userInformations, setUserInformations] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    document.title = "Log in to Task Manager";
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    login(userInformations, dispatch);
  };
  const handleGoogleSuccess = (credentialResponse) => {
    googleLogin(credentialResponse.credential, dispatch);
  };
  const handleGoogleError = () => {
    alert('Google login failed. Please try again.');
    console.error('Google Login Error');
  };
  return (
    <>
      <BgContainer>
        <Background />
      </BgContainer>
      <Container>
        <LogoIconContainer onClick={() => history.push("/")}>
          <Icon src={Logo} />
        </LogoIconContainer>
        <FormSection>
          <FormCard>
            <Form onSubmit={(e) => handleSubmit(e)}>
              <Title>Log in to Task Manager</Title>
              <Input
                type="email"
                placeholder="Enter email"
                required
                value={userInformations.email}
                onChange={(e) =>
                  setUserInformations({
                    ...userInformations,
                    email: e.target.value,
                  })
                }
              />
              <Input
                type="password"
                placeholder="Enter password"
                required
                value={userInformations.password}
                onChange={(e) =>
                  setUserInformations({
                    ...userInformations,
                    password: e.target.value,
                  })
                }
              />
              <Button>Log in</Button>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
              </div>
              <Hr />
              <Link
                fontSize="0.85rem"
                onClick={() => history.push("/register")}
              >
                Sign up for an account
              </Link>
            </Form>
          </FormCard>
        </FormSection>
      </Container>
    </>
  );
};

export default Login;
