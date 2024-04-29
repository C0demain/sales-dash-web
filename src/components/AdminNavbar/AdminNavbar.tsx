import { useNavigate } from 'react-router-dom';
import './index.css'

const Navbargest = () => {
    const navigate = useNavigate()
  
    const handleLogout = () => {
      localStorage.removeItem('userID');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userToken');
      navigate("/login");
    };

    return (
      <div className="navbar">
        <h1>Olá Gestor</h1><br></br>
        <ul>
          <li><button onClick={e => navigate('/dashboard')} className='Botao_barra'>Dashboard</button></li>
          <li><button onClick={e => navigate('/sells/table')}className='Botao_barra'>Upload Planilha</button></li>
          <li><button onClick={e => navigate('/sells/register')} className='Botao_barra'>Cadastro de Vendas</button></li>
          <li><button onClick={e => navigate('/sellers/register')}className='Botao_barra'>Cadastro de Vendedores</button></li>
          <li><button onClick={e => navigate('/product/register')}className='Botao_barra'>Cadastro de Produtos</button></li>
          <li><button onClick={e => navigate('/client/register')}className='Botao_barra'>Cadastro de Clientes</button></li>
          <li><button onClick={e => navigate('/client/list')}className='Botao_barra'>Exibe Clientes</button></li>
          <li><button onClick={e => navigate('')}className='Botao_barra'>Exibe Produtos</button></li>
          <li><button onClick={e => navigate('/commissions')}className='Botao_barra'>Comissões</button></li>
          <li><button onClick={e => handleLogout()} className='Botao_barra'>Sair da conta</button></li>
        </ul>
      </div>
    );
  }
  
  export default Navbargest;