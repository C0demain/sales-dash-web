import { useState } from 'react';
import React from 'react';
import './index.css';
import SelectClient from 'components/SelectClient/SelectClient';
import SelectProduct from 'components/SelectProduct/SelectProduct';
import SelectSeller from 'components/SelectSeller/SelectSeller';
import UploadExcelPage from 'components/UploadPage/UploadPage';
import { sendData } from '.';
import Navbargest from "components/AdminNavbar/AdminNavbar";
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import { DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import InputMask from 'react-input-mask';

export default function RegisterSell() {
  const [seller, setSeller] = useState<any>();
  const [client, setClient] = useState<any>();
  const [product, setProduct] = useState<any>();
  const [date, setDate] = useState<any>();
  const [value, setValue] = useState<any>();
  const [errors, setErrors] = useState({ date: '', seller: '', client: '', product: '', value: '' });
  const [success, setSuccess] = useState('');

  const validate = () => {
    let isValid = true;
    const errors = { date: '', seller: '', client: '', product: '', value: '' };

    if (!date) {
      message.error('Você deve preencher a data da venda.');
      isValid = false;
    }

    if (!seller) {
      message.error('Você deve preencher o e-mail de vendedor.');
      isValid = false;
    }

    if (!client) {
      message.error('Você deve preencher o CPF do cliente.');
      isValid = false;
    }

    if (!product) {
      message.error('Você deve escolher o produto.');
      isValid = false;
    }

    if (!value) {
      message.error('Você deve preencher o valor.');
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validate()) {
      message.success('Cadastro realizado!');
      sendData(date, seller[0], client[0], product[0], value);
    }
  };

  const formatDate = (date: dayjs.Dayjs) => {
    return date.format('DD/MM/YYYY');
  };

  const formatCurrency = (value: any) => {
    return parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <NavbarWrapper>
      <Navbargest />
      <div className='containerGlobal'>
          <UploadExcelPage />
        <div className='containerRegisterSell'>

          <div className="caixaVenda">
            <h1 className='titulo'>Cadastro de Venda</h1>

            <form className="formularioVenda" onSubmit={handleSubmit}>
              <div className='insertTextVenda'>
                <label>Data da venda:</label>
                <DatePicker
                  format='DD/MM/YYYY'
                  placeholder='Escolha uma data'
                  onChange={e => { setDate(formatDate(e)) }}
                />
                {errors.date && <p style={{ color: 'red' }}>{errors.date}</p>}
              </div>

              <div className='insertTextVenda'>
                <label>Vendedor</label>
                <SelectSeller controlState={[seller, setSeller]} dataKey="cpf" />
                {errors.seller && <p style={{ color: 'red' }}>{errors.seller}</p>}
              </div>

              <div className='insertTextVenda'>
                <label>Cliente</label>
                <SelectClient controlState={[client, setClient]} dataKey='cpf' className='selectVendas' />
                {errors.client && <p style={{ color: 'red' }}>{errors.client}</p>}
              </div>

              <div className='insertTextVenda'>
                <label>Produto</label>
                <SelectProduct controlState={[product, setProduct]} dataKey='id' className='selectProduct' />
                {errors.product && <p style={{ color: 'red' }}>{errors.product}</p>}
              </div>

              <div className='insertTextVenda'>
                <label>Valor da venda</label>
                <InputMask
                  placeholder='  R$'
                  mask="R$9999999"
                  className='inputValor'
                  onChange={e => setValue(formatCurrency(e.target.value))}
                />
                {errors.value && <p style={{ color: 'red' }}>{errors.value}</p>}
              </div>
              {success && <p className='funciona'>{success}</p>}
              <button className='botaoCadastrar' type='submit'>Cadastrar</button>
            </form>
          </div>
        </div>
      </div>
    </NavbarWrapper>
  )
}
