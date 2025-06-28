import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Space,
  Spin,
  Table,
  theme,
  Typography,
} from "antd";
import { Link, Navigate } from "react-router-dom";

import {
  LoadingOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createUser, getUsers } from "../../http/api";
import { useAuthStore } from "../../store";
import UserFilter from "./userFilter";
import { useState } from "react";
import UserForm from "./forms/userForm";
import type { CreateUser, UserData } from "../../types";
import { PER_PAGE } from "../../constants";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Full Name",
    dataIndex: "firstName",
    key: "firstName",
    // _text -> This means that we are not using the text parameter
    // This is how we gtoup multiple column data into one column
    render: (_text: string, record: UserData) => {
      return (
        <div>
          {record.firstName} {record.lastName}
        </div>
      );
    },
  },

  // This is used to show in single column

  // {
  //   title: "Last Name",
  //   dataIndex: "lastName",
  //   key: "lastName",
  // },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
];

const User = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // This is used to get the theme of the application
  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const [queryParams, setQueryParams] = useState({
    currentPage: 1,
    perPage: PER_PAGE,
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const {
    data: users,
    // isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: async () => {
      // Here we are converting the queryParams to a query string
      // like this currentPage=1&perPage=10
      const queryString = new URLSearchParams(
        queryParams as unknown as Record<string, string>
      ).toString();
      console.log("queryString", queryString);
      const res = await getUsers(queryString);

      return res.data;
    },
    // This is used to keep the previous data when the user is navigating back and forth
    // It hold and show the previous data when the user is navigating back and forth
    // If get the data from the server , it will not show the previous data , it will show the new data
    // If we use this , so we dont have loading state when we are navigating back and forth , but we get the isFetching state
    placeholderData: keepPreviousData,
  });

  const { user } = useAuthStore();

  if (user?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }

  const { mutate: userMutate } = useMutation({
    mutationKey: ["users"],
    mutationFn: async (data: CreateUser) =>
      createUser(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDrawerOpen(false);
      form.resetFields();
      return;
    },
  });

  const onHandleSubmit = async () => {
    await form.validateFields();
    await userMutate(form.getFieldsValue());
    console.log(form.getFieldsValue());
  };

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Flex justify="space-between">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to="/">Dashboard</Link> },
              { title: "Users" },
            ]}
          />

          {isFetching && (
            <Spin
              indicator={
                <LoadingOutlined style={{ fontSize: 24, color: "red" }} />
              }
            />
          )}
          {isError && (
            <Typography.Text type="danger">{error.message}</Typography.Text>
          )}
        </Flex>

        <UserFilter
          onFilterChange={(filterName: string, filterValue: string) => {
            console.log(filterName, filterValue);
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setIsDrawerOpen(true);
            }}
          >
            Add User
          </Button>
        </UserFilter>

        <Table
          columns={columns}
          dataSource={users?.data}
          rowKey={"id"}
          pagination={{
            total: users?.total,
            current: queryParams.currentPage,
            pageSize: queryParams.perPage,

            onChange: (page, pageSize) => {
              console.log("page", page);
              console.log("pageSize", pageSize);

              // setQueryParams({
              //   currentPage: page,
              //   perPage: pageSize || PER_PAGE,
              // });
              // This is used to update the queryParams , with persisting the previous values
              setQueryParams((prev) => {
                return {
                  ...prev,
                  currentPage: page,
                  // perPage: pageSize || PER_PAGE,
                };
              });
            },
          }}
        />

        <Drawer
          title="Create User"
          width={720}
          styles={{
            body: {
              backgroundColor: colorBgLayout,
            },
          }}
          destroyOnHidden={true}
          open={isDrawerOpen}
          onClose={() => {
            form.resetFields();
            setIsDrawerOpen(false);
            console.log("close");
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  form.resetFields();
                  setIsDrawerOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={onHandleSubmit}>
                Submit
              </Button>
            </Space>
          }
        >
          {/* <p>Some Content</p>
          <p>Some Content</p> */}

          <Form layout="vertical" form={form}>
            <UserForm />
          </Form>
        </Drawer>
      </Space>
      {/* {users && (
        <div>
          <h1>Users</h1>
          <ul>
            {users?.map((user: User) => (
              <li key={user.id}>
                {user.firstName} {user.lastName}
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </>
  );
};

export default User;
