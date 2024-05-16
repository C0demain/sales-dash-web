import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartBar, FaUserPlus, FaUsers, FaSignOutAlt, FaUser, FaClipboardList, FaShoppingCart, FaMoneyBillAlt, FaAngleDown, FaAngleUp } from 'react-icons/fa'; // Importe os ícones necessários
import { useAuth } from 'context/AuthProvider/useAuth';
import './index.css';

const Navbar = () => {
    const navigate = useNavigate();
    const [showCadastro, setShowCadastro] = useState(false);
    const { isAdmin } = useAuth();
  
    const handleLogout = () => {
      localStorage.removeItem('user');
      navigate("/login");
    };

    return (
      <div className="navbar">
        <div className='navbarTitle'>
          <h2><FaUser /> Olá {isAdmin() ? "Gestor" : "Vendedor"}</h2>
        <ul>
          {isAdmin() ? 
            <li><button onClick={() => navigate('/dashboardAdmin')}><FaChartBar /> Dashboard</button></li>
            : <li><button onClick={() => navigate('/dashboardSeller')}><FaChartBar /> Dashboard</button></li>
          }
          <li>
            <button onClick={() => setShowCadastro(!showCadastro)}>
              <FaUserPlus /> Cadastro {showCadastro ? <FaAngleUp /> : <FaAngleDown />}
            </button>
            {showCadastro && (
              <ul>
                <li><button onClick={() => navigate('/sells/register')}><FaClipboardList /> Cadastro de Vendas</button></li>
                {isAdmin() && <li><button onClick={() => navigate('/sellers/register')}><FaUsers /> Cadastro de Usuários</button></li>}
                <li><button onClick={() => navigate('/client/register')}><FaUserPlus /> Cadastro de Clientes</button></li>
              </ul>
            )}
          </li>
          <li><button onClick={() => navigate('/client/list')}><FaUsers /> Exibe Clientes</button></li>
          <li><button onClick={() => navigate('/product/list')}><FaShoppingCart /> Exibe Produtos</button></li>
          <li><button onClick={() => navigate('/sell/showsales')}><FaClipboardList /> Exibe Vendas</button></li>
          <li><button onClick={() => navigate('/commissions')}><FaMoneyBillAlt /> Comissões</button></li>
          <li><button onClick={handleLogout}><FaSignOutAlt /> Sair da conta</button></li>
        </ul>
        </div>
      </div>
    );
}

export default Navbar;
