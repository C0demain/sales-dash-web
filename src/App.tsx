import styled from "styled-components";
import { Route, Routes } from "react-router-dom";
import Login from "components/Login/Login";
import UploadExcelPage from "components/UploadPage/UploadPage";
import Dashboard from "components/dashboard/Dashboard";
import CommissionList from "components/ComissionList/ComissionList";
import ShowClient from "components/ShowClient/ShowClient";
import CommissionRegister from "components/ComissionRegister/ComissionRegister";
import RegisterProduct from "components/RegisterProduct/RegisterProduct"
import RegisterSell from "components/RegisterSell/RegisterSell";
import RegisterClient from "components/RegisterClient/RegisterClient";
import RegisterUser from "components/RegisterUser/RegisterUser";



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
        <Route path='/sellers/register' element={<RegisterUser/>}></Route>
        <Route path='/commissions/register' element={<CommissionRegister/>}></Route>
        <Route path='/commissions' element={<CommissionList/>}></Route>
        <Route path='/commissions/register' element={<CommissionRegister/>}></Route>
        <Route path ='/sells/table' element= {<UploadExcelPage/>}></Route>
        <Route path="/sells/register" element={<RegisterSell/>}></Route>
        <Route path='/product/register' element={<RegisterProduct/>}></Route>
        <Route path='/client/register' element={<RegisterClient/>}></Route>
        <Route path='/client/list' element={<ShowClient/>}></Route>
      </Routes>
    </AppContainer>
  );
}

export default App;

