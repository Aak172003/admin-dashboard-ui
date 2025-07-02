import { Card, Col, Form, Input, Row, Select } from "antd";

type UserFilterProps = {
  // onFilterChange: (filterName: string, filterValue: string) => void;
  children?: React.ReactNode;
};

const UserFilter = ({ children }: UserFilterProps) => {
  return (
    <Card>
      <Row justify="space-between">
        <Col span={16}>
          <Row gutter={20}>
            <Col span={8}>
              <Form.Item name="q">
                <Input.Search
                  placeholder="Search"
                  allowClear={true}
                  // onChange={(e) => {
                  //   console.log(e.target.value);
                  //   onFilterChange("searchFilter", e.target.value);
                  // }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="role">
                <Select
                  id="selectRoleInUserFilter"
                  style={{ width: "100%" }}
                  allowClear={true}
                  placeholder="Select Role"
                  // onChange={(selectedRole) => {
                  //   console.log(selectedRole);
                  //   onFilterChange("roleFilter", selectedRole);
                  // }}
                >
                  <Select.Option value="admin">Admin</Select.Option>
                  <Select.Option value="manager">Manager</Select.Option>
                  <Select.Option value="customer">Customer</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            {/* <Col span={8}>
              <Select
                style={{ width: "100%" }}
                allowClear={true}
                placeholder="Select Status"
                onChange={(selectedStatus) => {
                  console.log(selectedStatus);
                  onFilterChange("statusFilter", selectedStatus);
                }}
              >
                <Select.Option value="banned">Banned</Select.Option>
                <Select.Option value="active">Active</Select.Option>
              </Select>
            </Col> */}
          </Row>
        </Col>
        <Col
          span={8}
          style={{
            display: "flex",
            justifyContent: "end",
          }}
        >
          {children}
        </Col>
      </Row>
    </Card>
  );
};

export default UserFilter;
