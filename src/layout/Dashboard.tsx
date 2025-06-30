import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store";
import {
  Avatar,
  Badge,
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
import { useLogout } from "../hooks/useLogout";

const { Header, Content, Footer, Sider } = Layout;

const getMenuItems = (role: string) => {
  // If we want to make sort these menu items in another form , so we can just put priority on every object , just before return we just sort based on priority

  const baseItems = [
    {
      key: "/",
      icon: <Icon component={HomeIcon} />,
      label: <NavLink to="/">Home</NavLink>,
    },
    // {
    //   key: "/users",
    //   icon: <UserOutlined />,
    //   label: <NavLink to="/users">Users</NavLink>,
    // },

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
  ];

  // if (role === "admin") {
  //   return [
  //     ...baseItems,
  //     {
  //       key: "/users",
  //       icon: <UserOutlined />,
  //       label: <NavLink to="/users">Users</NavLink>,
  //     },
  //   ];
  // }

  // How we can put in particular postion
  if (role === "admin") {
    const menu = [...baseItems];
    // This will modify existing array and add new item at index 1
    // 1 is the index where we want to add the new item
    // 0 is the number of items to remove
    // {
    //   key: "/users",
    //   icon: <UserOutlined />,
    //   label: <NavLink to="/users">Users</NavLink>,
    // } is the new item to add
    menu.splice(1, 0, {
      key: "/users",
      icon: <UserOutlined />,
      label: <NavLink to="/users">Users</NavLink>,
    });
    menu.splice(2, 0, {
      key: "/restaurants",
      icon: <Icon component={RestaurantsIcon} />,
      label: <NavLink to="/restaurants">Restaurants</NavLink>,
    });

    return menu;
  }

  return baseItems;
};

const Dashboard = () => {
  const location = useLocation();
  const { logoutMutate } = useLogout();

  const { user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  // This is used to get the theme of the application
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  console.log("location 111111111111111111111111", location);
  // If user is not logged in , then redirect to login page
  if (user === null) {
    return (
      <Navigate
        to={`/auth/login?returnTo=${location.pathname}`}
        replace={true}
      />
    );
  }

  // Get the menu items based on the role of the user , also in above we just check user not to be null
  const items = getMenuItems(user.role);

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
            // defaultSelectedKeys={["/"]}
            defaultSelectedKeys={[location.pathname]}
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
              <Badge
                text={
                  // here tenant is optional so we need to check if it is defined
                  user.role === "admin" ? "You are an admin" : user.tenant?.name
                }
                status="success"
              />

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
          <Content style={{ margin: "24px" }}>
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
