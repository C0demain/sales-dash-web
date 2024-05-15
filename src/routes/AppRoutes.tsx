import CommissionList from "components/CommissionList/CommissionList";
import CommissionRegister from "components/CommissionRegister/CommissionRegister";
import { Login } from "components/Login";
import { ProtectedLayout } from "components/ProtectedLayout";
import RegisterClient from "components/RegisterClient/RegisterClient";
import RegisterSell from "components/RegisterSell/RegisterSell";
import RegisterUser from "components/RegisterUser/RegisterUser";
import ShowClient from "components/ShowClient/ShowClient";
import Dashboard from "components/Dashboard/dashboard";
import DashboardSeller from "components/DashboardSeller/DashboardSeller";
import { AuthProvider } from "context/AuthProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ShowProduct from "components/ShowProduct/ShowProduct";
import ShowSales from "components/ShowSales/ShowSales";

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

          <Route path='/dashboard' element={
            <ProtectedLayout adminOnly>
              <Dashboard />
            </ProtectedLayout>} >
          </Route>

          <Route path='/sellers/register' element={
            <ProtectedLayout adminOnly>
              <RegisterUser />
            </ProtectedLayout>} >
          </Route>

          <Route path='/commissions/register' element={
            <ProtectedLayout adminOnly>
              <CommissionRegister />
            </ProtectedLayout>} >
          </Route>

          <Route path='/commissions' element={
            <ProtectedLayout>
              <CommissionList />
            </ProtectedLayout>} >
          </Route>

          <Route path='/sells/register' element={
            <ProtectedLayout>
              <RegisterSell />
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
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}