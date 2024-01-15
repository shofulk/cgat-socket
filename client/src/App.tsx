import { useContext, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import MainPage from "./pages/MainPage.tsx";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import NavPanel from "./components/NavPanel";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { user } = useContext(AuthContext) ?? {};
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <NavPanel />
      <Routes>
        <Route
          path="/"
          element={
            <MainPage />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/registraction" element={<Registration />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
