import styled from "styled-components";
import { Route, Routes } from "react-router-dom";
import Login from "components/Login/Login";
import UploadExcelPage from "components/UploadPage/UploadPage";
import Dashboard from "components/dashboard/dashboard";
import CommissionList from "components/ComissionList/ComissionList";
import ShowClient from "components/ShowClient/ShowClient";
import CommissionRegister from "components/ComissionRegister/ComissionRegister";
import RegisterProduct from "components/RegisterProduct/RegisterProduct"
import RegisterSell from "components/RegisterSell/RegisterSell";
import RegisterClient from "components/RegisterClient/RegisterClient";
import RegisterUser from "components/RegisterUser/RegisterUser";
import { RequireAuth } from "react-auth-kit";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
`;

function App() {
  return (
    <AppContainer>
      <Routes>
        {/* Rota de Login sem autenticação*/}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Rota de Dashboard */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth loginPath="/login">
              <Dashboard />
            </RequireAuth>
          }
        ></Route>

        {/* Rota de Cadastro de Vendedores */}
        <Route
          path="/sellers/register"
          element={
            <RequireAuth loginPath="/login">
              <RegisterUser />
            </RequireAuth>
          }
        />

        {/* Rota de Cadastro de Comissões */}
        <Route
          path="/commissions/register"
          element={
            <RequireAuth loginPath="/login">
              <CommissionRegister />
            </RequireAuth>
          }
        />

        <Route
          path="/commissions"
          element={
            <RequireAuth loginPath="/login">
              <CommissionList />
            </RequireAuth>
          }
        />

        {/* Rota de Tabela de Vendas */}
        <Route
          path="/sells/table"
          element={
            <RequireAuth loginPath="/login">
              <UploadExcelPage />
            </RequireAuth>
          }
        />

        {/* Rota de Cadastro de Vendas */}
        <Route
          path="/sells/register"
          element={
            <RequireAuth loginPath="/login">
              <RegisterSell />
            </RequireAuth>
          }
        />

        {/* Rota de Cadastro de Produtos */}
        <Route
          path="/product/register"
          element={
            <RequireAuth loginPath="/login">
              <RegisterProduct />
            </RequireAuth>
          }
        />

        {/* Rota de Cadastro de Clientes */}
        <Route
          path="/client/register"
          element={
            <RequireAuth loginPath="/login">
              <RegisterClient />
            </RequireAuth>
          }
        />

        <Route
          path="/client/list"
          element={
            <RequireAuth loginPath="/login">
              <ShowClient />
            </RequireAuth>
          }
        />
      </Routes>
    </AppContainer>
  );
}

export default App;
