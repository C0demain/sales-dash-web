import CommissionList from "components/CommissionList/CommissionList";
import CommissionRegister from "components/CommissionRegister/CommissionRegister";
import { Login } from "components/Login";
import { ProtectedLayout } from "components/ProtectedLayout";
import RegisterClient from "components/RegisterClient/RegisterClient";
import RegisterProduct from "components/RegisterProduct/RegisterProduct";
import RegisterSell from "components/RegisterSell/RegisterSell";
import RegisterUser from "components/RegisterUser/RegisterUser";
import ShowClient from "components/ShowClient/ShowClient";
import UploadExcelPage from "components/UploadPage/UploadPage";
import Dashboard from "components/dashboard/dashboard";
import { AuthProvider } from "context/AuthProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ShowProduct from "components/ShowProduct/ShowProduct";

export function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Rotas Públicas */}
          <Route path='/' element={<Login />}></Route>
          <Route path='/login' element={<Login />}></Route>

          {/* Rotas Privadas */}
          <Route path='/dashboard' element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>} >
          </Route>

          <Route path='/sellers/register' element={
            <ProtectedLayout>
              <RegisterUser />
            </ProtectedLayout>} >
          </Route>

          <Route path='/commissions/register' element={
            <ProtectedLayout>
              <CommissionRegister />
            </ProtectedLayout>} >
          </Route>

          <Route path='/commissions' element={
            <ProtectedLayout>
              <CommissionList />
            </ProtectedLayout>} >
          </Route>

          <Route path='/sells/table' element={
            <ProtectedLayout>
              <UploadExcelPage />
            </ProtectedLayout>} >
          </Route>

          <Route path='/sells/register' element={
            <ProtectedLayout>
              <RegisterSell />
            </ProtectedLayout>} >
          </Route>

          <Route path='/product/register' element={
            <ProtectedLayout>
              <RegisterProduct />
            </ProtectedLayout>} >
          </Route>

          <Route path='/product/list' element={
            <ProtectedLayout>
              <ShowProduct />
            </ProtectedLayout>} >
          </Route>

          <Route path='/client/register' element={
            <ProtectedLayout>
              <RegisterClient />
            </ProtectedLayout>} >
          </Route>

          <Route path='/client/list' element={
            <ProtectedLayout>
              <ShowClient />
            </ProtectedLayout>} >
          </Route>

          

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}