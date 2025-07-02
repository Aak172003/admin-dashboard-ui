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
import { createUser, getUsers, updateUser } from "../../http/api";
import { useAuthStore } from "../../store";
import UserFilter from "./userFilter";
import { useEffect, useMemo, useState } from "react";
import UserForm from "./forms/userForm";
import type { CreateUser, FieldData, UserData } from "../../types";
import { PER_PAGE } from "../../constants";
import { debounce } from "lodash";

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
  {
    title: "Tenant",
    dataIndex: "tenant",
    key: "tenant",
    render: (_text: string, record: UserData) => {
      return (
        <div>
          {record?.tenant?.name} {record?.tenant?.address}
        </div>
      );
    },
  },
];

const User = () => {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  // default value is null , means no user is selected
  const [currentEditingUser, setCurrentUser] = useState<UserData | null>(null);

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

  useEffect(() => {
    if (currentEditingUser) {
      setIsDrawerOpen(true);
      form.setFieldsValue({
        ...currentEditingUser,
        tenantId: currentEditingUser.tenant?.id,
      });
    }
  }, [currentEditingUser, form]);

  const {
    data: users,
    // isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: async () => {
      // This is used to filter the queryParams , so that we dont send the undefined values to the server
      // Means we are not sending the undefined values to the server

      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1])
      );
      // Here we are converting the queryParams to a query string
      // like this currentPage=1&perPage=10
      const queryString = new URLSearchParams(
        // queryParams as unknown as Record<string, string>

        filteredParams as unknown as Record<string, string>
      ).toString();
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

  const debounceQUpdate = useMemo(() => {
    return debounce((value: string | undefined) => {
      if (!value) return;
      setQueryParams((prev) => ({
        ...prev,
        q: value,
        currentPage: 1,
      }));
    }, 500);
  }, []);

  const onFilterChange = (changedFields: FieldData[]) => {
    const changeFilterFields = changedFields
      .map((item) => {
        return {
          [item.name[0]]: item.value,
        };
      })
      .reduce((acc, curr) => ({ ...acc, ...curr }), {});

    if ("q" in changeFilterFields) {
      // Implement the debounce logic here
      // We will use the debounce function to delay the execution of the function , which is provided by loadash
      debounceQUpdate(changeFilterFields.q);
    } else {
      setQueryParams((prev) => ({
        ...prev,
        ...changeFilterFields,
        currentPage: 1,
      }));
    }
  };

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

  const { mutate: updateUserMutate } = useMutation({
    mutationKey: ["update-users"],
    mutationFn: async (data: CreateUser) =>
      updateUser(currentEditingUser!.id, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDrawerOpen(false);
      form.resetFields();
      return;
    },
  });

  console.log("updateUserMutate :::::::::::::: ", updateUserMutate);

  const onHandleSubmit = async () => {
    const isEditMode = !!currentEditingUser;

    console.log("isEditMode :::::::::::::: ", isEditMode);

    // This is for validation of the form
    await form.validateFields();

    if (isEditMode) {
      console.log("editing ...............");

      await updateUserMutate(form.getFieldsValue());
      setCurrentUser(null);
    } else {
      console.log("adding ...............");
      await userMutate(form.getFieldsValue());
      setCurrentUser(null);
    }

    form.resetFields();
    setIsDrawerOpen(false);
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

        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <UserFilter
          // onFilterChange={(filterName: string, filterValue: string) => {
          //   console.log(filterName, filterValue);
          // }}
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
        </Form>

        <Table
          columns={[
            ...columns,
            {
              title: "Actions",
              key: "actions",
              render: (_: string, record: UserData) => {
                console.log("record : record : record", record);
                console.log(" -------------------------------- ", _);
                return (
                  <Button
                    type="link"
                    onClick={() => {
                      setCurrentUser(record);
                    }}
                  >
                    Edit
                  </Button>
                );
              },
            },
          ]}
          dataSource={users?.data}
          rowKey={"id"}
          pagination={{
            total: users?.total,
            current: queryParams.currentPage,
            pageSize: queryParams.perPage,

            onChange: (page, pageSize) => {
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
            showTotal: (total: number, range: number[]) => {
              return (
                <Typography.Text>
                  Showing {range[0]}-{range[1]} of {total} users
                </Typography.Text>
              );
            },
          }}
        />

        <Drawer
          title={currentEditingUser ? "Edit User" : "Add User"}
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
            setCurrentUser(null);
            setIsDrawerOpen(false);
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
            <UserForm isEditMode={!!currentEditingUser} />
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
