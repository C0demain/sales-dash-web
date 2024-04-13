import './Barra_lateral.css'
import React from 'react'
import { Container } from '../commons';
const Navbar = () => {
    return (
      <div className="navbar">
        <h1>Olá Usuário</h1><br></br>
        <ul>
          <li><button className='Botao_barra'><p className='textbutton'>Dashboard</p></button></li>
          <li><button className='Botao_barra'><p className='textbutton'>Cadastro de Vendas</p></button></li>
          <li><button className='Botao_barra'><p className='textbutton'>Ranking</p></button></li>
        </ul>
      </div>
    );
  }
  
  export default Navbar;