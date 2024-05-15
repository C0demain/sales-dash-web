import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css'
import { useAuth } from 'context/AuthProvider/useAuth';

const Navbargest = () => {
    const navigate = useNavigate()
    const [showCadastro, setShowCadastro] = useState(false);
    const { isAdmin } = useAuth()
  
    const handleLogout = () => {
      localStorage.removeItem('user');
      navigate("/login");
    };

    return (
      <div className="navbar">
        <h1>Olá {isAdmin() ? "Gestor" : "Vendedor"}</h1><br></br>
        <ul>
          {isAdmin() ? 
          <li><button onClick={e => navigate('/dashboard')} className='Botao_barra'>Dashboard</button></li>
          : <li><button onClick={e => navigate('/dashboardSeller')} className='Botao_barra'>Dashboard</button></li>
          }
          <li><button onClick={e => setShowCadastro(!showCadastro)} className='Botao_barra'>Cadastro</button></li>
                {showCadastro && (
                    <>
                        <li><button onClick={e => navigate('/sells/register')} className='Sub_Botao_barra'>Cadastro de Vendas</button></li>
                        {isAdmin() && <li><button onClick={e => navigate('/sellers/register')} className='Sub_Botao_barra'>Cadastro de Usuários</button></li>}
                        <li><button onClick={e => navigate('/client/register')} className='Sub_Botao_barra'>Cadastro de Clientes</button></li>
                    </>
                )}
          <li><button onClick={e => navigate('/client/list')}className='Botao_barra'>Exibe Clientes</button></li>
          <li><button onClick={e => navigate('/product/list')}className='Botao_barra'>Exibe Produtos</button></li>
          <li><button onClick={e => navigate('/sell/showsales')}className='Botao_barra'>Exibe Vendas</button></li>
          <li><button onClick={e => navigate('/commissions')}className='Botao_barra'>Comissões</button></li>
          <li><button onClick={e => handleLogout()} className='Botao_barra'>Sair da conta</button></li>
        </ul>
      </div>
    );
  }
  
  export default Navbargest;
