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
import { DatePicker, InputNumber } from 'antd'
import dayjs from 'dayjs'

export function CadastroVenda(){
  const [seller, setSeller] = useState<any>()
  const [client, setClient] = useState<any>()
  const [product, setProduct] = useState<any>()
  const [date, setDate] = useState<any>()
  const [value, setValue] = useState<any>()
  const [errors, setErrors] = useState({date: '', seller:'', client:'', product:'', value: ''})   
  const [sucess, setSucess] = useState('')
  
    /* VALIDANDO INFORMAÇÕES UTILIZADAS */

    const validate = () =>{
        let isValid = true
        const errors = {date: '', seller: '', client: '', product: '', value: ''}

        if(!date){
          errors.date = 'Você deve preencher a data da venda.'
          isValid = false
        }


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

        if(!value){
          errors.value = 'Você deve preencher o valor.'
          isValid = false
        }

        setErrors(errors)
        return isValid
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validate()) {
          setSucess('Cadastro realizado!')
          enviarDadosParaBackend(date, seller[0], client[0], product[0], value)
        }
    }

    const formatDate = (date: dayjs.Dayjs) =>{
      return date.format('DD/MM/YYYY')
    }

    const parseValue = (value: any) =>{
      return parseFloat(value?.replace(',', '.'))
    }

    return(
      <NavbarWrapper>
      <Navbargest/>

      <div className='container cadastroVenda'>

      <div className="box">
        <h1 className='titulo'>Registro de nova venda!</h1>

        <form className="formulario" onSubmit={handleSubmit}>
          <div className='insertText'>
            <label>Data da venda:</label>

            <DatePicker onChange={e => {setDate(formatDate(e))} } format={'DD/MM/YYYY'} />

            {errors.date && <p style={{ color: 'red' }}>{errors.date}</p>}
          </div>
          <div className='insertText'>
            <label>Vendedor</label>

            <SelectSeller controlState={[seller, setSeller]} dataKey="cpf" className='selectVendas'/>

            {errors.seller && <p style={{ color: 'red' }}>{errors.seller}</p>}
          </div>

          <div className='insertText'>
            <label>Cliente</label>

            <SelectClient controlState={[client, setClient]} dataKey='cpf' className='selectVendas'/>

            {errors.client && <p style={{ color: 'red' }}>{errors.client}</p>}
          </div>

          <div className='insertText'>
            <label>Produto</label>

            <SelectProduct controlState={[product, setProduct]} dataKey='id' className='selectProduct'/>

            {errors.product && <p style={{ color: 'red' }}>{errors.product}</p>}
          </div>

          <div className='insertText'>
            <label>Valor da venda</label>

            <InputNumber addonBefore="R$" onChange={e => {setValue(parseValue(e))} } stringMode/>

            {errors.value && <p style={{ color: 'red' }}>{errors.value}</p>}
          </div>
            {sucess && <p className='funciona'>{sucess}</p>}
            <button className='botaoEnvia' type='submit'>Cadastrar</button>
        </form>
      </div>
    </div>
    </NavbarWrapper>
  )
}