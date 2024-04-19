import styled from "styled-components";
import { Route, Routes } from "react-router-dom";
import CadastroUser from "./components/CadastroUser/pages/CadastroUser";
import CadastroProduto from "./components/CadastroProduto/pages/CadastroProduto";
import CadastroCliente from "./components/CadastroCliente/pages/CadastroCliente";
import CommissionRegister from "./components/SystemComission/page/CommissionRegister";
import UploadExcelPage from "./components/CarregadorArquivo/pages/Carregador";
import { Dashboard } from "./components/dashboard/dashboard";
import { CadastroVenda } from "./components/cadastroVendas/pages/cadastroVenda";
import CommissionList from "./components/SystemComission/page/CommissionList";
import ListaCliente from "./components/ExibeCliente/pages/ListaCliente";
import { Login } from "./components/login";
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
        />

        {/* Rota de Cadastro de Vendedores */}
        <Route
          path="/sellers/register"
          element={
            <RequireAuth loginPath="/login">
              <CadastroUser />
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
              <CadastroVenda />
            </RequireAuth>
          }
        />

        {/* Rota de Cadastro de Produtos */}
        <Route
          path="/product/register"
          element={
            <RequireAuth loginPath="/login">
              <CadastroProduto />
            </RequireAuth>
          }
        />

        {/* Rota de Cadastro de Clientes */}
        <Route
          path="/client/register"
          element={
            <RequireAuth loginPath="/login">
              <CadastroCliente />
            </RequireAuth>
          }
        />

        <Route
          path="/client/list"
          element={
            <RequireAuth loginPath="/login">
              <ListaCliente />
            </RequireAuth>
          }
        />

      </Routes>
    </AppContainer>
  );
}

export default App;
