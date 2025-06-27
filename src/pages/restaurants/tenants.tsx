import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getTenants } from "../../http/api";
import { useAuthStore } from "../../store";
import { Link, Navigate } from "react-router-dom";
import { Breadcrumb, Space, Table, Drawer, Button, theme } from "antd";
import { RightOutlined, PlusOutlined } from "@ant-design/icons";
import TenantFilter from "./tenantFilter";

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  // This is used to get the theme of the application
  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const {
    data: tenants,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      const res = await getTenants();
      return res.data;
    },
  });

  const { user } = useAuthStore();

  if (user?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to="/">Dashboard</Link> },
            { title: "Tenants" },
          ]}
        />
        {isLoading && <div>Loading...</div>}
        {isError && <div>Error: {error.message}</div>}

        <TenantFilter
          onFilterChange={(filterName: string, filterValue: string) => {
            console.log(filterName, filterValue);
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setDrawerOpen(true)}
          >
            Add Tenant
          </Button>
        </TenantFilter>

        <Table columns={columns} dataSource={tenants} rowKey={"id"} />
        <Drawer
          title="Create restaurant"
          width={720}
          styles={{
            body: {
              backgroundColor: colorBgLayout,
            },
          }}
          destroyOnClose={true}
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
          }}
          extra={
            <Space>
              <Button>Cancel</Button>
              <Button type="primary">Submit</Button>
            </Space>
          }
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Drawer>
      </Space>
    </>
  );
};

export default Tenants;
