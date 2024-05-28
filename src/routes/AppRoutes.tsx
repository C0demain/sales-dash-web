import ShowCommissions from "components/CommissionList/ShowCommissions";
import { Login } from "components/Login";
import { ProtectedLayout } from "components/ProtectedLayout";
import RegisterClient from "components/RegisterClient/RegisterClient";
import RegisterSell from "components/RegisterSell/RegisterSell";
import RegisterUser from "components/RegisterUser/RegisterUser";
import ShowClient from "components/ShowClient/ShowClient";
import DashboardAdmin from "components/DashboardAdmin/dashboardAdmin";
import DashboardSeller from "components/DashboardSeller/DashboardSeller";
import { AuthProvider } from "context/AuthProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ShowProduct from "components/ShowProduct/ShowProduct";
import ShowSales from "components/ShowSales/ShowSales";
import ShowSalesSeller from "components/ShowSalesSeller/ShowSalesSeller";
import UpdatePassword from "components/UpdatePassword/UpdatePassword";
import RegisterProduct from "components/RegisterProduct/RegisterProduct";
import ShowUsers from "components/ShowUsers/ShowUsers";

export function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Rotas Públicas */}
          <Route path='/' element={<Login />}></Route>
          <Route path='/login' element={<Login />}></Route>

          {/* Rotas Privadas */}
          <Route path="/dashboardSeller" element={
            <ProtectedLayout sellerOnly>
              <DashboardSeller/>
            </ProtectedLayout>}>
          </Route>

          <Route path='/dashboardAdmin' element={
            <ProtectedLayout adminOnly>
              <DashboardAdmin />
            </ProtectedLayout>} >
          </Route>

          <Route path='/users/register' element={
            <ProtectedLayout adminOnly>
              <RegisterUser/>
            </ProtectedLayout>} >
          </Route>

          <Route path='/commissions' element={
            <ProtectedLayout>
              <ShowCommissions />
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

          <Route path='/sell/showsales' element={
            <ProtectedLayout>
              <ShowSales />
            </ProtectedLayout>} >
          </Route>

          <Route path='/sell/showsalesseller' element={
            <ProtectedLayout>
              <ShowSalesSeller />
            </ProtectedLayout>} >
          </Route>

          <Route path='/users/showusers' element={
            <ProtectedLayout>
              <ShowUsers />
            </ProtectedLayout>} >
          </Route>

          <Route path='/users/update' element={
            <ProtectedLayout>
              <UpdatePassword/>
            </ProtectedLayout> }>
          </Route>
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}