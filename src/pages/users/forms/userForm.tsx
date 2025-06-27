import { Card, Col, Form, Input, Row, Select, Space } from "antd";
import { getTenants } from "../../../http/api";
import { useQuery } from "@tanstack/react-query";
import type { TenantData } from "../../../types";

const UserForm = () => {
  const { data: tenants } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      const res = await getTenants();
      return res.data;
    },
  });

  return (
    <Row>
      <Col span={24}>
        <Space direction="vertical" size="large">
          <Card title="Basic Info" bordered>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label="First Name " name="firstName">
                  <Input placeholder="Enter First Name" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Last Name " name="lastName">
                  <Input placeholder="Enter Last Name" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Email " name="email">
                  <Input placeholder="Enter Email" size="large" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Role" bordered>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label="Role" name="role">
                  <Select
                    size="large"
                    style={{ width: "100%" }}
                    allowClear={true}
                    placeholder="Select Role"
                    onChange={() => {}}
                  >
                    <Select.Option value="admin">Admin</Select.Option>
                    <Select.Option value="manager">Manager</Select.Option>
                    <Select.Option value="customer">Customer</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Resturants" name="tenantId">
                  <Select
                    size="large"
                    style={{ width: "100%" }}
                    allowClear={true}
                    placeholder="Select Resturants"
                    onChange={() => {}}
                  >
                    {tenants?.map((tenant: TenantData) => (
                      <Select.Option key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </Select.Option>
                    ))}

                    {/* <Select.Option value="admin">Tenant 1</Select.Option>
                    <Select.Option value="manager">Tenant 2</Select.Option>
                    <Select.Option value="customer">Tenant 3</Select.Option> */}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default UserForm;
