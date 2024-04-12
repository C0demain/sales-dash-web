import styled from "styled-components";
import { Route, Routes } from "react-router-dom";
import { Login } from "./components/login";
import { RequireAuth } from "react-auth-kit";
import { Dashboard } from "./components/dashboard/dashboard";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
`;

function App() {
  return (
    <AppContainer>
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard/>
          }
        ></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </AppContainer>
  );
}

export default App;
