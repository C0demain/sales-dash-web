import ShowCommissions from "components/CommissionList/CommissionsList";
import { Login } from "components/Login";
import { ProtectedLayout } from "components/ProtectedLayout";
import RegisterClient from "components/RegisterClient/RegisterClient";
import RegisterSell from "components/RegisterSell/RegisterSell";
import RegisterUser from "components/RegisterUser/RegisterUser";
import ShowClient from "components/ShowClient/ShowClient";
import DashboardAdmin from "components/DashboardAdmin/dashboardAdmin";
import DashboardSeller from "components/DashboardSeller/DashboardSeller";
import { AuthProvider } from "context/AuthProvider";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ShowProduct from "components/ShowProduct/ShowProduct";
import ShowSalesAdmin from "components/ShowSalesAdmin/ShowSalesAdmin";
import ShowSalesSeller from "components/ShowSalesSeller/ShowSalesSeller";
import UpdatePassword from "components/UpdatePassword/UpdatePassword";
import RegisterProduct from "components/RegisterProduct/RegisterProduct";
import ShowUsers from "components/ShowUsers/ShowUsers";
import DatabaseCleaner from "components/DatabaseCleaner";
import APIdoc from "components/APIdoc/APIdoc";
import ShowProductsSeller from "components/ShowProductsSeller/ShowProductsSeller";
import ShowClientsSeller from "components/ShowClientsSeller/ShowClientsSeller";

export function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Rotas Públicas */}
          <Route path='/' element={<Login />}></Route>
          <Route path='/login' element={<Login />}></Route>

          {/* Redirecionamento para o login se a rota não existir */}
          <Route path='*' element={<Navigate to="/login" />} />

          {/* Rotas Privadas */}
          <Route path="/dashboardSeller" element={
            <ProtectedLayout sellerOnly>
              <DashboardSeller />
            </ProtectedLayout>}>
          </Route>

          <Route path='/dashboardAdmin' element={
            <ProtectedLayout adminOnly>
              <DashboardAdmin />
            </ProtectedLayout>} >
          </Route>

          <Route path='/users/register' element={
            <ProtectedLayout adminOnly>
              <RegisterUser />
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

          <Route path='/products/register' element={
            <ProtectedLayout>
              <RegisterProduct />
            </ProtectedLayout>} >
          </Route>

          <Route path='/products' element={
            <ProtectedLayout adminOnly>
              <ShowProduct />
            </ProtectedLayout>} >
          </Route>

          <Route path='/productsSeller' element={
            <ProtectedLayout>
              <ShowProductsSeller />
            </ProtectedLayout>} >
          </Route>

          <Route path='/clients/register' element={
            <ProtectedLayout>
              <RegisterClient />
            </ProtectedLayout>} >
          </Route>

          <Route path='/clients' element={
            <ProtectedLayout adminOnly>
              <ShowClient />
            </ProtectedLayout>} >
          </Route>

          <Route path='/clientsSeller' element={
            <ProtectedLayout>
              <ShowClientsSeller />
            </ProtectedLayout>} >
          </Route>

          <Route path='/salesManager' element={
            <ProtectedLayout adminOnly>
              <ShowSalesAdmin />
            </ProtectedLayout>} >
          </Route>

          <Route path='/salesSeller' element={
            <ProtectedLayout>
              <ShowSalesSeller />
            </ProtectedLayout>} >
          </Route>

          <Route path='/users' element={
            <ProtectedLayout adminOnly>
              <ShowUsers />
            </ProtectedLayout>} >
          </Route>

          <Route path='/users/update' element={
            <ProtectedLayout>
              <UpdatePassword />
            </ProtectedLayout>}>
          </Route>

          <Route path='cleanDatabase' element={
            <ProtectedLayout adminOnly>
              <DatabaseCleaner />
            </ProtectedLayout>}>
          </Route>

          <Route path="/docs" element={
            <ProtectedLayout adminOnly>
              <APIdoc />
            </ProtectedLayout>}>
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}