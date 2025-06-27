import { Card, Col, Input, Row } from "antd";

type TenantFilterProps = {
  onFilterChange: (filterName: string, filterValue: string) => void;
  children?: React.ReactNode;
};

const TenantFilter = ({ onFilterChange, children }: TenantFilterProps) => {
  return (
    <Card>
      <Row justify="space-between">
        <Col span={16}>
          <Row gutter={20}>
            <Col span={12}>
              <Input.Search
                allowClear={true}
                placeholder="Search"
                onChange={(e) => onFilterChange("searchFilter", e.target.value)}
              />
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
