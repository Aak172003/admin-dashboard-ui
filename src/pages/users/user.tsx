import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

import { RightOutlined } from "@ant-design/icons";

const User = () => {
  return (
    <>
      <Breadcrumb
        separator={<RightOutlined />}
        items={[{ title: <Link to="/">Dashboard</Link> }, { title: "Users" }]}
      />
    </>
  );
};

export default User;
