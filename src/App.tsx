import styled from "styled-components";
import { Route, Routes } from "react-router-dom";
import { Login } from "./components/login";
import CadastroUser from "./components/CadastroUser/pages/CadastroUser";
import CadastroProduto from "./components/CadastroProduto/pages/CadastroProduto";
import CadastroCliente from "./components/CadastroCliente/pages/CadastroCliente";
import CommissionRegister from "./components/SystemComission/page/CommissionRegister";
// import CadastroVendas from "./components/CadastroVenda/pages/CadastroVendas";
import UploadExcelPage from "./components/CarregadorArquivo/pages/Carregador";

import { Dashboard } from "./components/dashboard/dashboard";
import { CadastroVenda } from "./components/cadastroVendas/pages/cadastroVenda";
import CommissionList from "./components/SystemComission/page/CommissionList";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
`;

function App() {
  return (
    <AppContainer>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <Dashboard/>
          }
        ></Route>
        <Route path="/" element={<Login />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path='/sellers/register' element={<CadastroUser/>}></Route>
        <Route path='/commissions/register' element={<CommissionRegister/>}></Route>
        <Route path='/commissions' element={<CommissionList/>}></Route>
        <Route path='/commissions/register' element={<CommissionRegister/>}></Route>
        <Route path ='/sells/table' element= {<UploadExcelPage/>}></Route>
        <Route path="/sells/register" element={<CadastroVenda/>}></Route>
        <Route path='/product/register' element={<CadastroProduto/>}></Route>
        <Route path='/client/register' element={<CadastroCliente/>}></Route>
      </Routes>
    </AppContainer>
  );
}

export default App;

