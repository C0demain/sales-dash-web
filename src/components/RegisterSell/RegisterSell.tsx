import { useState } from 'react'
import React from 'react'
import './index.css'
import SelectClient from 'components/SelectClient/SelectClient'
import SelectProduct from 'components/SelectProduct/SelectProduct'
import SelectSeller from 'components/SelectSeller/SelectSeller'
import {sendData} from '.'
import Navbargest from "components/AdminNavbar/AdminNavbar";
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import { DatePicker, InputNumber } from 'antd'
import dayjs from 'dayjs'

export default function RegisterSell(){
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
          sendData(date, seller[0], client[0], product[0], value)
        }
      }

    const formatDate = (date: dayjs.Dayjs) =>{
      return date.format('YYYY-MM-DD')
    }

    const parseValue = (value: any) =>{
      return parseFloat(value?.replace(',', '.'))
    }

    return(
      <NavbarWrapper>
      <Navbargest/>

      <div className='containerVenda'>

      <div className="caixaVenda">
        <h1 className='titulo'>Cadastro de Venda</h1>

        <form className="formularioVenda" onSubmit={handleSubmit}>
          <div className='insertText'>
            <label placeholder='Escolha uma data'>Data da venda:</label>

            <DatePicker style={{ height: '5vh', borderRadius: '1vh', backgroundColor: 'white', borderColor: 'black' }}onChange={e => {setDate(formatDate(e))} } />

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

            <InputNumber className='inputValor' addonBefore="R$" onChange={e => {setValue(parseValue(e))} } stringMode/>

            {errors.value && <p style={{ color: 'red' }}>{errors.value}</p>}
          </div>
            {sucess && <p className='funciona'>{sucess}</p>}
            <button type='submit'>Cadastrar</button>
        </form>
      </div>
    </div>
    </NavbarWrapper>
  )
}