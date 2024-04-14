import styled from "styled-components";
import { Route, Routes } from "react-router-dom";
import { Login } from "./components/login";
import { RequireAuth } from "react-auth-kit";
import CadastroUser from "./components/CadastroUser/pages/CadastroUser";
import SystemComission from "./components/SystemComission/page/SystemComission";
// import CadastroVendas from "./components/CadastroVenda/pages/CadastroVendas";
import UploadExcelPage from "./components/CarregadorArquivo/pages/Carregador";

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
          path="/dashboard"
          element={
            <Dashboard/>
          }
        ></Route>
        <Route path="/" element={<Login />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path='/sellers/register' element={<CadastroUser/>}></Route>
        <Route path='/commissions/register' element={<SystemComission/>}></Route>
        {/* <Route path='/cadastroVendas' element={<CadastroVendas/>}></Route> */}
        <Route path ='/sells/table' element= {<UploadExcelPage/>}></Route>
      </Routes>
    </AppContainer>
  );
}

export default App;

