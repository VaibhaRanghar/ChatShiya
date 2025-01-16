import { useContext } from "react";
import { Alert, Button, Col, Form, Row, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { loginInfo, loginUser, updateLoginInfo, loginError, isLoginLoading } =
    useContext(AuthContext);

  return (
    <Form onSubmit={loginUser}>
      <Row
        style={{
          height: "100vh",
          justifyContent: "center",
          padding: "15%",
        }}
      >
        <Col xs={8}>
          <Stack gap={4}>
            <h2>Login</h2>
            <Form.Control
              type="email"
              placeholder="Email"
              onChange={(e) => {
                updateLoginInfo({ ...loginInfo, email: e.target.value });
              }}
            />
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => {
                updateLoginInfo({ ...loginInfo, password: e.target.value });
              }}
            />
            <Button variant="primary" type="submit">
              {isLoginLoading ? "Logging in" : "Login"}
            </Button>
            {loginError?.error && (
              <Alert variant="danger">
                <p>{loginError?.message}</p>
              </Alert>
            )}
          </Stack>
        </Col>
      </Row>
    </Form>
  );
}

export default Login;
