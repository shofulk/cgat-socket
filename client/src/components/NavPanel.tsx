import { useContext } from "react";
import { Button, Flex, Typography } from "antd";
import {Link, useNavigate} from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const { Title } = Typography;
function NavPanel() {
  const { user, updateAuthUser } = useContext(AuthContext) ?? {};
  const navigate = useNavigate();
  const handleLogout = () => {
    updateAuthUser?.(null);
    navigate('/login');
  };

  return (
    <Flex align="center" justify="space-between">
      <Title level={2}>
        <Link to="/">Chat</Link>
      </Title>
      {!!user && <Title level={3}>{user?.name}</Title>}
      <Flex justify="space-between" align="center">
        {!user ? (
          <>
            <Button>
              <Link to="/login">Sing in</Link>
            </Button>
            <Button>
              <Link to="/registraction">Sing up</Link>
            </Button>
          </>
        ) : (
          <Button onClick={handleLogout}>Logout</Button>
        )}
      </Flex>
    </Flex>
  );
}

export default NavPanel;
