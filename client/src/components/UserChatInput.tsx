import { Form, Input, Button, Row, Col } from "antd";
import { SendOutlined } from "@ant-design/icons";

type UserChatInputType = {
  handleCreateMessage: (message: string, cb: () => void) => void
};

export function UserChatInput({ handleCreateMessage }: UserChatInputType) {
  const [form] = Form.useForm();

  const handleFinish = async () => {
    handleCreateMessage(form.getFieldValue('message'), () => {
      form.resetFields();
    });
  }

  return (
    <Form layout="inline" form={form} className="user_chat_input" onFinish={handleFinish}>
      <Row style={{ width: "100%" }}>
        <Col style={{ width: "90%" }}>
          <Form.Item name="message">
            <Input placeholder="Message" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item>
            <Button
              htmlType="submit"
              shape="circle"
              icon={<SendOutlined />}
            ></Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
