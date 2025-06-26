import { Card, Col, Form, Input, Row } from "antd";

const UserForm = () => {
  return (
    <Row>
      <Col span={24}>
        <Card title="Basic Info" bordered>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item label="First Name " name="firstName">
                <Input placeholder="Enter First Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Last Name " name="lastName">
                <Input placeholder="Enter Last Name" />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default UserForm;
