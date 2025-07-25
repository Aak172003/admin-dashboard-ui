import {
  Button,
  Card,
  Col,
  List,
  Row,
  Skeleton,
  Space,
  Statistic,
  Tag,
  Typography,
} from "antd";
import { useAuthStore } from "../store";
import { getGreeting } from "../utils";
import Icon from "@ant-design/icons";
import type { ComponentType } from "react";
import { orderList } from "../content/orderList";
import { Link } from "react-router-dom";
import { BarChartIcon } from "../assets/icons/BarChart";
import BasketIcon from "../assets/icons/BasketIcon";
const { Title, Text } = Typography;

interface CardTitleProps {
  title: string;
  PrefixIcon: ComponentType<unknown>;
}

const CardTitle = ({ title, PrefixIcon }: CardTitleProps) => {
  return (
    <Space>
      <Icon component={PrefixIcon} />
      {title}
    </Space>
  );
};

function HomePage() {
  const { user } = useAuthStore();
  // get greeting based on current time
  const greeting = getGreeting();

  return (
    <div>
      <Title level={3}>
        {greeting} {user?.firstName} {user?.lastName} 😄
      </Title>

      <Row className="mt-4" gutter={16}>
        <Col span={12}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card variant="borderless">
                <Statistic title="Total orders" value={52} />
              </Card>
            </Col>
            <Col span={12}>
              <Card variant="borderless">
                <Statistic
                  title="Total sale"
                  value={70000}
                  precision={2}
                  prefix="₹"
                />
              </Card>
            </Col>
            <Col span={24}>
              <Card
                title={<CardTitle title="Sales" PrefixIcon={BarChartIcon} />}
                variant="borderless"
              ></Card>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Card
            variant="borderless"
            title={<CardTitle title="Recent orders" PrefixIcon={BasketIcon} />}
          >
            <List
              className="demo-loadmore-list"
              loading={false}
              itemLayout="horizontal"
              loadMore={true}
              dataSource={orderList}
              renderItem={(item) => (
                <List.Item>
                  <Skeleton avatar title={false} loading={item.loading} active>
                    <List.Item.Meta
                      title={
                        <a href="https://ant.design">{item.OrderSummary}</a>
                      }
                      description={item.address}
                    />
                    <Row style={{ flex: 1 }} justify="space-between">
                      <Col>
                        <Text strong>₹{item.amount}</Text>
                      </Col>
                      <Col>
                        <Tag color="volcano">{item.status}</Tag>
                      </Col>
                    </Row>
                  </Skeleton>
                </List.Item>
              )}
            />
            <div style={{ marginTop: 20 }}>
              <Button type="link">
                <Link to="/orders">See all orders</Link>
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default HomePage;
