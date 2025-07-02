import { Card, Col, Form, Input, Row, Select, Space } from "antd";
import { getTenants } from "../../../http/api";
import { useQuery } from "@tanstack/react-query";
import type { TenantData } from "../../../types";

const UserForm = ({ isEditMode = false }: { isEditMode: boolean }) => {
  const { data: tenants } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => {
      // TODO: make this dynamic, like search for tenants in the input
      return getTenants(`perPage=100&currentPage=1`).then((res) => res.data);
    },
  });

  return (
    <Row>
      <Col span={24}>
        <Space direction="vertical" size="large">
          <Card title="Basic Info" bordered>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="First Name "
                  name="firstName"
                  rules={[
                    { required: true, message: "First Name is required" },
                  ]}
                >
                  <Input placeholder="Enter First Name" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Last Name "
                  name="lastName"
                  rules={[{ required: true, message: "Last Name is required" }]}
                >
                  <Input placeholder="Enter Last Name" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Email "
                  name="email"
                  rules={[
                    { required: true, message: "Email is required" },
                    { type: "email", message: "Invalid email address" },
                  ]}
                >
                  <Input placeholder="Enter Email" size="large" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {!isEditMode && (
            <Card title="Security Info" bordered>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      { required: true, message: "Password is required" },
                    ]}
                  >
                    <Input.Password
                      size="large"
                      style={{ width: "100%" }}
                      allowClear={true}
                      placeholder="Enter Password"
                      onChange={() => {}}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          )}

          <Card title="Role" bordered>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Role"
                  name="role"
                  rules={[{ required: true, message: "Role is required" }]}
                >
                  <Select
                    id="selectRoleInUserForm"
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
                <Form.Item
                  label="Restaurant"
                  name="tenantId"
                  rules={[
                    { required: true, message: "Restaurant is required" },
                  ]}
                >
                  <Select
                    id="selectTenantInUserForm"
                    size="large"
                    style={{ width: "100%" }}
                    allowClear={true}
                    placeholder="Select Restaurant"
                    onChange={() => {}}
                  >
                    {tenants?.data?.map((tenant: TenantData) => (
                      <Select.Option key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </Select.Option>
                    ))}
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
