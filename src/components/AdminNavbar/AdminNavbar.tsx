import React, { useState } from 'react';
import {
  DashboardOutlined,
  UserAddOutlined,
  TeamOutlined,
  UserOutlined,
  UnorderedListOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  DollarOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Breadcrumb, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'context/AuthProvider/useAuth';
import './index.css';
 
const { Header, Content, Footer, Sider } = Layout;
 
const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  const [showCadastro, setShowCadastro] = useState(false);
  const { isAdmin } = useAuth();
 
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate("/login");
  };
 
  const items = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: isAdmin() ? 'Dashboard Admin' : 'Dashboard Vendedor',
      onClick: () => navigate(isAdmin() ? '/dashboardAdmin' : '/dashboardSeller'),
    },
    {
      key: '2',
      icon: <UserAddOutlined />,
      label: 'Cadastro',
      onClick: () => setShowCadastro(!showCadastro),
      children: showCadastro ? [
        {
          key: '2-1',
          icon: <FileTextOutlined />,
          label: 'Cadastro de Vendas',
          onClick: () => navigate('/sells/register'),
        },
        isAdmin() && {
          key: '2-2',
          icon: <TeamOutlined />,
          label: 'Cadastro de Usuários',
          onClick: () => navigate('/sellers/register'),
        },
        {
          key: '2-3',
          icon: <UserAddOutlined />,
          label: 'Cadastro de Clientes',
          onClick: () => navigate('/client/register'),
        }
      ].filter(Boolean) : null,
    },
    {
      key: '3',
      icon: <UnorderedListOutlined />,
      label: 'Exibe Clientes',
      onClick: () => navigate('/client/list'),
    },
    {
      key: '4',
      icon: <ShoppingOutlined />,
      label: 'Exibe Produtos',
      onClick: () => navigate('/product/list'),
    },
    {
      key: '5',
      icon: <FileTextOutlined />,
      label: 'Exibe Vendas',
      onClick: () => navigate('/sell/showsales'),
    },
    {
      key: '6',
      icon: <DollarOutlined />,
      label: 'Comissões',
      onClick: () => navigate('/commissions'),
    },
    {
      key: '7',
      icon: <LogoutOutlined />,
      label: 'Sair da conta',
      onClick: handleLogout,
    }
  ];
 
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
 
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{ left: 0, top: 0, bottom: 0, zIndex: 1 }}>
        <div style={{ padding: '16px', color: 'white', textAlign: 'center', background: '#001529' }}>
          <UserOutlined />
          {!collapsed && <span> Olá {isAdmin() ? "Gestor" : "Vendedor"}</span>}
        </div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
    </Layout>
  );
};
 
export default Navbar;