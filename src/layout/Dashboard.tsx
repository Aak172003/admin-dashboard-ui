import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "../store";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Flex,
  Layout,
  Menu,
  Space,
  theme,
} from "antd";
import { useState } from "react";
import Icon, {
  ShoppingCartOutlined,
  UserOutlined,
  GiftOutlined,
  BellFilled,
} from "@ant-design/icons";
import Logo from "../assets/icons/logo";
import HomeIcon from "../assets/sideDashBoard/home";
import RestaurantsIcon from "../assets/sideDashBoard/restaurants";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../http/api";

const { Header, Content, Footer, Sider } = Layout;

const items = [
  {
    key: "/",
    icon: <Icon component={HomeIcon} />,
    label: <NavLink to="/">Home</NavLink>,
  },
  {
    key: "/users",
    icon: <UserOutlined />,
    label: <NavLink to="/users">Users</NavLink>,
  },

  {
    key: "/restaurants",
    icon: <Icon component={RestaurantsIcon} />,
    label: <NavLink to="/restaurants">Restaurants</NavLink>,
  },

  {
    key: "/products",
    icon: <ShoppingCartOutlined />,
    label: <NavLink to="/products">Products</NavLink>,
  },
  {
    key: "/promos",
    icon: <GiftOutlined />,
    label: <NavLink to="/promos">Promos</NavLink>,
  },

  {
    key: "/settings",
  },
];

const Dashboard = () => {
  const { logout: logoutFromStore } = useAuthStore();

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

  const { user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  // This is used to get the theme of the application
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // If user is not logged in , then redirect to login page
  if (user === null) {
    return <Navigate to="/auth/login" replace={true} />;
  }

  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        {/* Sider is used to display the menu */}
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          theme="light"
        >
          <div className="logo">
            <Logo />
          </div>
          <Menu
            theme="light"
            defaultSelectedKeys={["/"]}
            mode="inline"
            items={items}
          />
        </Sider>

        {/* Layout is used to display the content */}
        <Layout>
          {/* Header is used to display the header */}
          <Header
            style={{
              paddingLeft: "16px",
              paddingRight: "16px",
              background: colorBgContainer,
            }}
          >
            <Flex gap="middle" align="center" justify="space-between">
              <Badge text="Admin" status="success" />

              <Space size={16}>
                <Badge dot={true}>
                  <BellFilled />
                </Badge>

                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "logout",
                        label: "Logout",
                        onClick: () => {
                          logoutMutate();
                        },
                      },
                    ],
                  }}
                >
                  <Avatar
                    style={{
                      backgroundColor: "#fde3cf",
                      color: "#f56a00",
                      cursor: "pointer",
                    }}
                  >
                    U
                  </Avatar>
                </Dropdown>
              </Space>
            </Flex>
          </Header>

          {/* Content is used to display the content */}
          <Content style={{ margin: "0 16px" }}>
            {/* Outlet is used to render the child component based on the route */}
            <Outlet />
          </Content>

          {/* Footer is used to display the footer */}
          <Footer style={{ textAlign: "center" }}>
            Mern Stack Pizza Store ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default Dashboard;
