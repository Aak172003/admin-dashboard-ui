import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { createTenant, getTenants } from "../../http/api";
import { useAuthStore } from "../../store";
import { Link, Navigate } from "react-router-dom";
import {
  Breadcrumb,
  Space,
  Table,
  Drawer,
  Button,
  theme,
  Form,
  Flex,
  Spin,
  Typography,
} from "antd";
import {
  RightOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import TenantFilter from "./tenantFilter";
import TenantForm from "./forms/tenantForm";
import { PER_PAGE } from "../../constants";
import type { CreateTenant, FieldData } from "../../types";
import { debounce } from "lodash";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
];
const Tenants = () => {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

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
    data: tenants,
    // isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["tenants", queryParams],
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
      console.log("queryString", queryString);

      const res = await getTenants(queryString);
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  console.log("tenants data fetched", tenants);

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
    console.log("changedFields", changedFields);

    const changeFilterFields = changedFields
      .map((item) => {
        return {
          [item.name[0]]: item.value,
        };
      })
      .reduce((acc, curr) => ({ ...acc, ...curr }), {});

    console.log("changeFields", changeFilterFields);

    if ("q" in changeFilterFields) {
      // Implement the debounce logic here
      // We will use the debounce function to delay the execution of the function , which is provided by loadash
      console.log("debounceQUpdate", changeFilterFields.q);
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

  const { mutate: tenantMutate } = useMutation({
    mutationKey: ["tenants"],
    mutationFn: async (data: CreateTenant) =>
      createTenant(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      setIsDrawerOpen(false);
      form.resetFields();
      return;
    },
  });

  const onHandleSubmit = async () => {
    await form.validateFields();
    await tenantMutate(form.getFieldsValue());
    console.log(form.getFieldsValue());
  };

  console.log("tenants?.data", tenants?.data);
  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Flex justify="space-between">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to="/">Dashboard</Link> },
              { title: "Tenants" },
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
          <TenantFilter
          // onFilterChange={(filterName: string, filterValue: string) => {
          //   console.log(filterName, filterValue);
          // }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsDrawerOpen(true)}
            >
              Add Tenant
            </Button>
          </TenantFilter>
        </Form>

        <Table
          columns={columns}
          dataSource={tenants?.data}
          rowKey={"id"}
          pagination={{
            total: tenants?.total,
            current: queryParams.currentPage,
            pageSize: queryParams.perPage,
            onChange: (page, pageSize) => {
              console.log("page", page);
              console.log("pageSize", pageSize);
              setQueryParams((prev) => ({
                ...prev,
                currentPage: page,
                // perPage: pageSize || PER_PAGE,
              }));
            },
            showTotal: (total: number, range: number[]) => {
              console.log("total", total);
              console.log("range", range);
              return (
                <Typography.Text>
                  Showing {range[0]}-{range[1]} of {total} tenants
                </Typography.Text>
              );
            },
          }}
        />
        <Drawer
          title="Create restaurant"
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
          <Form layout="vertical" form={form}>
            <TenantForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Tenants;
