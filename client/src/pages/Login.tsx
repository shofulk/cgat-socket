import {useState, useContext, useEffect} from "react";
import { Form, Input, Button, Row, Flex, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { AuthContext } from "../context/AuthContext";

const { Title, Text } = Typography;

type FieldType = {
  email?: string;
  password?: string;
};

function Login() {
  const [error, setError] = useState();
  const [form] = Form.useForm();
  const { user, updateAuthUser } = useContext(AuthContext) ?? {};
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      updateAuthUser?.(null);
    }
  }, []);

  const handleFinish = async () => {
    try {
      const response = await axios.post("/login", form.getFieldsValue());
      updateAuthUser?.(response.data);
      navigate('/');
    } catch (e) {
      console.log(e)
      setError(e?.response?.data?.message);
    }
  };

  return (
    <Flex vertical align="center" style={{ height: "85vh" }} justify="center">
      <Row>
        <Title level={3}>Login</Title>
      </Row>
      <Row>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 900 }}
          onFinish={handleFinish}
          form={form}
        >
          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
            style={{ width: "100%" }}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item<FieldType> wrapperCol={{ offset: 8, span: 16 }}>
            <Button htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>
      </Row>
      {error && <Text type="danger">{error}</Text>}
    </Flex>
  );
}

export default Login;
