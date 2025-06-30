import { Card, Col, Form, Row, Space, Input } from "antd";

const TenantForm = () => {
  return (
    <Row>
      <Col span={24}>
        <Space direction="vertical" size="large">
          <Card title="Basic Info" bordered>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Tenant Name "
                  name="name"
                  rules={[
                    { required: true, message: "Tenant Name is required" },
                  ]}
                >
                  <Input placeholder="Enter Tenant Name" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Tenant Address "
                  name="address"
                  rules={[
                    { required: true, message: "Tenant Address is required" },
                  ]}
                >
                  <Input placeholder="Enter Tenant Address" size="large" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default TenantForm;
