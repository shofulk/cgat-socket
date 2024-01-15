import { Form, Input, Button, Row, Flex, Typography } from "antd";
import axios from "../utils/axios";
import { useState } from "react";

const { Title, Text } = Typography;

type FieldType = {
  email: string;
  password: string;
  name: string;
};

function Registration() {
  const [error, setError] = useState<string>();
  const [form] = Form.useForm();

  const handleFinish = async () => {
    try {
      const response = await axios.post(`/registration`, form.getFieldsValue());
    } catch (e) {
      console.log("error", e);
      setError(e?.response?.data?.message);
    }
  };

  return (
    <Flex vertical align="center" style={{ height: "85vh" }} justify="center">
      <Row>
        <Title level={3}>Registration</Title>
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
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input password!" }]}
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

export default Registration;
