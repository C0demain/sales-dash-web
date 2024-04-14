import './Barra_lateral.css'
import { Link, useNavigate } from 'react-router-dom';

const Navbargest = () => {
    const navigate = useNavigate()
    return (
      <div className="navbar">
        <h1>Olá Gestor</h1><br></br>
        <ul>
          <li><button onClick={e => navigate('/dashboard')} className='Botao_barra'>Dashboard</button></li>
          <li><button onClick={e => navigate('/sells/table')}className='Botao_barra'>Cadastro de Vendas por Planilha</button></li>
          <li><button onClick={e => navigate('/sellers/register')}className='Botao_barra'>Cadastro de Vendedor</button></li>
        </ul>
      </div>
    );
  }
  
  export default Navbargest;