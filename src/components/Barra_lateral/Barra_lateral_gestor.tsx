import './Barra_lateral.css'
import React from 'react'
import { Container } from '../commons';
const Navbargest = () => {
    return (
      <div className="navbar">
        <h1>Olá Gestor</h1><br></br>
        <ul>
          <li><button className='Botao_barra'>Dashboard</button></li>
          <li><button className='Botao_barra'>Cadastro de Vendas</button></li>
          <li><button className='Botao_barra'>Cadastro de Vendedor</button></li>
          <li><button className='Botao_barra'>Cadastro de Produtos</button></li>
          <li><button className='Botao_barra'>Ranking</button></li>
        </ul>
      </div>
    );
  }
  
  export default Navbargest;