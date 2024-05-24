import React, { useEffect, useState } from 'react';
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
import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'context/AuthProvider/useAuth';

const { Sider } = Layout;

type MenuItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [collapsed] = useState(true);
  const [selectedKey, setSelectedKey] = useState<string>('0');

  useEffect(() => {
    const storedKey = localStorage.getItem('selectedKey');
    if (storedKey) setSelectedKey(storedKey);
  }, []);

  const handleSelect = (key: string) => {
    setSelectedKey(key);
    localStorage.setItem('selectedKey', key);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('selectedKey')
    navigate("/login");
  };

  const items: MenuItem[] = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => {
        handleSelect('1');
        navigate(isAdmin() ? '/dashboardAdmin' : '/dashboardSeller');
      },
    },
    {
      key: '2-1',
      icon: <FileTextOutlined />,
      label: 'Cadastro de Vendas',
      onClick: () => {
        handleSelect('2-1');
        navigate('/sells/register');
      },
    },
    isAdmin() && {
      key: '2-2',
      icon: <TeamOutlined />,
      label: 'Cadastro de Usuários',
      onClick: () => {
        handleSelect('2-2');
        navigate('/sellers/register');
      },
    },
    {
      key: '2-3',
      icon: <UserAddOutlined />,
      label: 'Cadastro de Clientes',
      onClick: () => {
        handleSelect('2-3');
        navigate('/client/register');
      },
    },
    {
      key: '3',
      icon: <UnorderedListOutlined />,
      label: 'Exibe Clientes',
      onClick: () => {
        handleSelect('3');
        navigate('/client/list');
      },
    },
    {
      key: '4',
      icon: <ShoppingOutlined />,
      label: 'Exibe Produtos',
      onClick: () => {
        handleSelect('4');
        navigate('/product/list');
      },
    },
    {
      key: '5',
      icon: <FileTextOutlined />,
      label: isAdmin() ? 'Exibe vendas' : 'Suas vendas',
      onClick: () => {
        handleSelect('5');
        navigate(isAdmin() ? '/sell/showsales' : '/sell/showsalesseller')
      },
    },
    {
      key: '6',
      icon: <DollarOutlined />,
      label: 'Comissões',
      onClick: () => {
        handleSelect('6');
        navigate('/commissions');
      },
    },
    {
      key: '7',
      icon: <LogoutOutlined />,
      label: 'Sair da conta',
      onClick: () => {
        handleSelect('7');
        handleLogout();
      },
    }
  ].filter(Boolean) as MenuItem[];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        width={250}
        style={{ minHeight: '100vh'}}
      >
        <div style={{ padding: '16px', color: 'white', textAlign: 'center', background: '#001529' }}>
          <UserOutlined />
          {collapsed && <span> Olá {isAdmin() ? "Gestor" : "Vendedor"}</span>}
        </div>
        <Menu theme="dark" selectedKeys={[selectedKey]} mode="inline" items={items} onSelect={({ key }) => handleSelect(key)}>
        </Menu>
      </Sider>
    </Layout>
  );
};

export default Navbar;
