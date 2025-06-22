import {
  Layout,
  Card,
  Space,
  Form,
  Input,
  Checkbox,
  Button,
  Flex,
  Alert,
} from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import Logo from "../../assets/icons/logo";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Credentials } from "../../types";
import { login, logout, self } from "../../http/api";
import { useAuthStore } from "../../store";
import { usePermission } from "../../hooks/usePermission";

const loginUser = async (credentials: Credentials) => {
  console.log("userData :::::::::::: ", credentials);
  // Server call logic

  const { data } = await login(credentials);
  console.log("response :::::::::::: ", data);
  return data;
};

const getSelf = async () => {
  const { data } = await self();
  console.log("response :::::::::::: ", data);
  return data;
};

const LoginPage = () => {
  const { isAllowed } = usePermission();

  // Get Hooks from Zustand
  const { setUser, logout: logoutFromStore } = useAuthStore();

  // getself
  // const { data: selfData, refetch } = useQuery({

  // Now we are using refetch to fetch the self data after login
  const { refetch } = useQuery({
    queryKey: ["self"],
    queryFn: getSelf,

    // This key is set to false which means
    // after component renders this gets executed but we want this to execute after getting successful response from login endpoint
    enabled: false,
  });

  // Mutation for logout , so we can perform proper error handling
  const { mutate: logoutMutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: () => {
      // After logout success we are calling the logoutFromStore function to logout the user from the store
      console.log("logout successfully");
      logoutFromStore();
      return;
    },
  });

  // isPending is used to show a loading spinner , it is true when the mutation is pending
  // isError is used to show an error message , it is true when the mutation is in error state
  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ["login"],
    mutationFn: loginUser,
    onSuccess: async () => {
      // login success
      const selfDataPromise = await refetch();

      // Logout or redirect to client ui

      // Do logout like this otherwise create a new mutation for logout
      if (!isAllowed(selfDataPromise.data)) {
        // Here we are calling the logout function from the api , because we make null state but now cookies are not null

        // perform logout from mutation
        // await logout();
        logoutMutate(); // this will call the logout function from the api

        // logoutFromStore is used to logout the user from the store
        // logoutFromStore();
        return;
      }

      setUser(selfDataPromise.data);
    },
  });

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
            <Logo />
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
            <Form
              initialValues={{ remember: true }}
              onFinish={(values) => {
                console.log("onFinish");
                console.log("values :::::::::::: ", values);
                mutate({ email: values.username, password: values.password });
              }}
            >
              {isError && (
                <Alert
                  style={{
                    marginBottom: 24,
                  }}
                  message={error.message}
                  type="error"
                />
              )}
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input your username ",
                  },
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Username" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                />
              </Form.Item>
              <Flex justify="space-between">
                <Form.Item name="remember" valuePropName="checked">
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <a href="#" id="login-form-forgot">
                  Forgot password?
                </a>
              </Flex>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  loading={isPending}
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
