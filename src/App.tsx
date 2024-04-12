import styled from "styled-components";
import { Route, Routes } from "react-router-dom";
import { Login } from "./components/login";
import  Home  from "./components/home";
import { RequireAuth } from "react-auth-kit";
import CadastroUser from "./components/CadastroUser/pages/CadastroUser";
import SystemComission from "./components/SystemComission/page/SystemComission";
import CadastroVendas from "./components/CadastroVenda/pages/CadastroVendas";
import UploadExcelPage from "./components/CarregadorArquivo/pages/Carregador";


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
            <RequireAuth loginPath="/login">
              <Home />
            </RequireAuth>
          }
        ></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path='/cadastro' element={<CadastroUser/>}></Route>
        <Route path='/comission' element={<SystemComission/>}></Route>
        <Route path='/cadastroVendas' element={<CadastroVendas/>}></Route>
        <Route path ='/table' element= {<UploadExcelPage/>}></Route>
      </Routes>
    </AppContainer>
  );
}

export default App;

