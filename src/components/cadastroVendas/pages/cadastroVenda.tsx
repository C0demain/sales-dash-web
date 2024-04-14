import { useEffect, useState } from 'react'
import axios from 'axios'
import React from 'react'
import './cadastroVenda.css'
import SelectClient from '../../dashboard/widgets/SelectClient'
import SelectProduct from '../../dashboard/widgets/SelectProduct'
import SelectSeller from '../../dashboard/widgets/SelectSeller'
import type {DefaultOptionType} from 'antd/es/select'
import enviarDadosParaBackend from '../functions/enviaDadosVenda'
import Navbargest from "../../Barra_lateral/Barra_lateral_gestor";
import NavbarWrapper from "../../Barra_lateral/NavbarWrapper/NavbarWrapper";

export function CadastroVenda(){
  const [seller, setSeller] = useState<any>()
  const [client, setClient] = useState<any>()
  const [product, setProduct] = useState<any>()
  const [errors, setErrors] = useState({seller:'', client:'', product:''})   
  const [sucess, setSucess] = useState('')
  
    /* VALIDANDO INFORMAÇÕES UTILIZADAS */

    const validate = () =>{
        let isValid = true
        const errors = {seller: '', client: '', product: ''}

        if(!seller){
          errors.seller = 'Você deve preencher o e-mail de vendedor.'
          isValid = false
        }

        if(!client){
          errors.client = 'Você deve preencher o CPF do cliente.'
          isValid = false
        }

        if(!product){
          errors.product = 'Você deve escolher o produto.'
          isValid = false
        }

        setErrors(errors)
        return isValid
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validate()) {
          setSucess('Cadastro realizado!')
          enviarDadosParaBackend(seller[0], client[0], product[0])   
          console.log(seller[0], client[0], product[0])        
        }
    }

    return(
      <NavbarWrapper>
      <Navbargest/>

      <div className='container'>

      <div className="box">
        <h1 className='titulo'>Registro de nova venda!</h1>

        <form className="formulario" onSubmit={handleSubmit}>
          <div className='insertText'>
            <label>Email do vendedor (selecione vendedores da lista):</label>

            <SelectSeller controlState={[seller, setSeller]} dataKey="cpf" className='selectVendas'/>

            {errors.seller && <p style={{ color: 'red' }}>{errors.seller}</p>}
          </div>

          <div className='insertText'>
            <label>CPF do comprador (selecione clientes da lista):</label>

            <SelectClient controlState={[client, setClient]} dataKey='cpf' className='selectVendas'/>

            {errors.client && <p style={{ color: 'red' }}>{errors.client}</p>}
          </div>

          <div className='insertText'>
            <label>Produto vendido (escolha um produto da lista):</label>

            <SelectProduct controlState={[product, setProduct]} dataKey='id' className='selectProduct'/>

            {errors.product && <p style={{ color: 'red' }}>{errors.product}</p>}
          </div>
            {sucess && <p className='funciona'>{sucess}</p>}
            <button className='botaoEnvia' type='submit'>Cadastrar</button>
        </form>
      </div>
    </div>
    </NavbarWrapper>
  )
}