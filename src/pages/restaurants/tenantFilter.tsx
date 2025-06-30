import { Card, Col, Form, Input, Row } from "antd";

type TenantFilterProps = {
  // onFilterChange: (filterName: string, filterValue: string) => void;
  children?: React.ReactNode;
};

const TenantFilter = ({ children }: TenantFilterProps) => {
  return (
    <Card>
      <Row justify="space-between">
        <Col span={16}>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item name="q">
                <Input.Search
                  placeholder="Search"
                  allowClear={true}
                  // onChange={(e) => {
                  //   console.log(e.target.value);
                  //   onFilterChange("searchFilter", e.target.value);
                  // }}
                  // onChange={(e) => onFilterChange("searchFilter", e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col span={8} style={{ display: "flex", justifyContent: "end" }}>
          {children}
        </Col>
      </Row>
    </Card>
  );
};

export default TenantFilter;
