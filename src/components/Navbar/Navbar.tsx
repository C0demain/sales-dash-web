import React, { useEffect, useState } from 'react';
import {
  PieChartOutlined,
  FileTextOutlined,
  TeamOutlined,
  UserAddOutlined,
  ShoppingOutlined,
  KeyOutlined,
  UnorderedListOutlined,
  DollarOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from 'context/AuthProvider/useAuth';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  onClick?: () => void,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    onClick,
    children,
    label,
  } as MenuItem;
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();
  const [collapsed, setCollapsed] = useState(() => {
    const savedState = localStorage.getItem('siderCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });
  const [isResponsive, setIsResponsive] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = isAdmin() ? 'Gestor' : 'Vendedor';
  const firstName = user.name ? user.name.split(' ')[0] : '';

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 800) {
        setCollapsed(true);
        setIsResponsive(true);
      } else {
        setIsResponsive(false);
      }
    };

    handleResize(); // Check initial width
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('siderCollapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('selectedKey');
    navigate('/login');
  };

  const commonItems: MenuItem[] = [
    getItem('Dashboard', '1', <PieChartOutlined />, () => navigate(isAdmin() ? '/dashboardAdmin' : '/dashboardSeller')),
    getItem('Cadastro de Vendas', '2-1', <FileTextOutlined />, () => navigate('/sells/register')),
    getItem('Cadastro de Clientes', '2-3', <UserAddOutlined />, () => navigate('/clients/register')),
    getItem('Cadastro de Produtos', '2-4', <ShoppingOutlined />, () => navigate('/products/register')),
    getItem('Atualização de Senha', '3', <KeyOutlined />, () => navigate('/users/update')),
    getItem(isAdmin() ? 'Exibe Clientes' : 'Seus Clientes', '6', <UnorderedListOutlined />, () => navigate(isAdmin() ? '/clients' : '/clientsSeller')),
    getItem(isAdmin() ? 'Exibe Produtos' : 'Seus Produtos', '7', <ShoppingOutlined />, () => navigate(isAdmin() ? '/products' : '/productsSeller')),
    getItem(isAdmin() ? 'Exibe Vendas' : 'Suas Vendas', '8', <FileTextOutlined />, () => navigate(isAdmin() ? '/salesAdmin' : '/salesSeller')),
    getItem('Comissões', '9', <DollarOutlined />, () => navigate('/commissions')),
    getItem('Sair da conta', '10', <LogoutOutlined />, handleLogout),
  ];

  const adminItems: MenuItem[] = [
    getItem('Cadastro de Usuários', '2-2', <TeamOutlined />, () => navigate('/users/register')),
    getItem('Exibe Usuários', '5', <TeamOutlined />, () => navigate('/users')),
  ];

  const items: MenuItem[] = isAdmin() ? [
    getItem('Dashboard', '1', <PieChartOutlined />, () => navigate('/dashboardAdmin')),
    getItem('Cadastro de Vendas', '2-1', <FileTextOutlined />, () => navigate('/sells/register')),
    getItem('Cadastro de Usuários', '2-2', <TeamOutlined />, () => navigate('/users/register')),
    getItem('Cadastro de Clientes', '2-3', <UserAddOutlined />, () => navigate('/clients/register')),
    getItem('Cadastro de Produtos', '2-4', <ShoppingOutlined />, () => navigate('/products/register')),
    getItem('Atualização de Senha', '3', <KeyOutlined />, () => navigate('/users/update')),
    getItem('Exibe Usuários', '5', <TeamOutlined />, () => navigate('/users')),
    getItem('Exibe Clientes', '6', <UnorderedListOutlined />, () => navigate('/clients')),
    getItem('Exibe Produtos', '7', <ShoppingOutlined />, () => navigate('/products')),
    getItem('Exibe Vendas', '8', <FileTextOutlined />, () => navigate('/salesAdmin')),
    getItem('Comissões', '9', <DollarOutlined />, () => navigate('/commissions')),
    getItem('Sair da conta', '10', <LogoutOutlined />, handleLogout),
  ] : commonItems;

  const getSelectedKey = (pathname: string): string => {
    switch (pathname) {
      case '/dashboardAdmin':
      case '/dashboardSeller':
        return '1';
      case '/sells/register':
        return '2-1';
      case '/users/register':
        return '2-2';
      case '/clients/register':
        return '2-3';
      case '/products/register':
        return '2-4';
      case '/users/update':
        return '3';
      case '/users':
        return '5';
      case '/clients':
      case '/clientsSeller':
        return '6';
      case '/products':
      case '/productsSeller':
        return '7';
      case '/salesAdmin':
      case '/salesSeller':
        return '8';
      case '/commissions':
        return '9';
      default:
        return '1';
    }
  };

  const [selectedKey, setSelectedKey] = useState<string>(getSelectedKey(location.pathname));

  useEffect(() => {
    setSelectedKey(getSelectedKey(location.pathname));
  }, [location.pathname]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => !isResponsive && setCollapsed(value)}
        width={230}
        style={{ overflow: 'auto', height: 'auto', position: 'fixed', left: 0, top: 0, bottom: 0 }}
      >
        <div style={{ padding: '10px', color: 'white', textAlign: 'center' }}>
          <UserOutlined />
          {!collapsed && <span> Olá, {firstName} </span>}
          {!collapsed && <div style={{ fontSize: '12px', color: '#ddd' }}> {role} </div>}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[selectedKey]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 90 : 220, transition: 'margin-left 0.2s' }}>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        {/* Add Content and Footer here */}
      </Layout>
    </Layout>
  );
};

export default Navbar;