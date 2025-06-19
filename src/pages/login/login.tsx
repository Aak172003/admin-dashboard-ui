import { Layout, Card, Space, Form, Input, Checkbox, Button } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import logo from "../../assets/logo.svg";

const LoginPage = () => {
  return (
    <>
      <Layout
        style={{
          height: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Space direction="vertical" align="center" size="large">
          <Layout.Content
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src={logo} alt="logo" />
          </Layout.Content>
          <Card
            style={{ width: 300 }}
            title={
              <Space
                style={{
                  width: "100%",
                  fontSize: 20,
                  justifyContent: "center",
                }}
              >
                <LockOutlined />
                Sign in{" "}
              </Space>
            }
          >
            <Form>
              <Form.Item name="username">
                <Input prefix={<UserOutlined />} placeholder="Username" />
              </Form.Item>
              <Form.Item name="password">
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item name="remember">
                <Checkbox>Remember me</Checkbox>
                <a href="#">Forgot password?</a>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Space>
      </Layout>
    </>
  );
};

export default LoginPage;
