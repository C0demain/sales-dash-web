import React, { useState } from 'react';
import './index.css';
import SelectClient from 'components/SelectClient/SelectClient';
import SelectProduct from 'components/SelectProduct/SelectProduct';
import SelectSeller from 'components/SelectSeller/SelectSeller';
import UploadExcelPage from 'components/UploadPage/UploadPage';
import { sendData } from '.';
import Navbar from "components/Navbar/Navbar";
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import { Button, DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import InputMask from 'react-input-mask';
import { useAuth } from 'context/AuthProvider/useAuth';

export default function RegisterSell() {
  const [seller, setSeller] = useState<any>();
  const [client, setClient] = useState<any>();
  const [product, setProduct] = useState<any>();
  const [date, setDate] = useState<any>(null);
  const [value, setValue] = useState<any>();
  const [errors] = useState({ date: '', seller: '', client: '', product: '', value: '' })
  const role = useAuth().role
  const user = useAuth().cpf
  const oculto = {display: 'none'}
  const mostrar = {display: 'flex'}

  const validate = () => {
    let isValid = true;
    
    if (role === 'admin' && !seller) {
      message.error('Você deve preencher o vendedor.');
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

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(user)
    if (validate()) {
      try {
        await sendData(date,role === 'admin'? seller[0]: user, client[0], product[0], parseFloat(value.replace(/[^\d.]/g, '')));
        message.success('Venda Cadastrada com Sucesso!');
        setDate(null);
        setSeller('');
        setClient('');
        setProduct('');
        setValue('');
      } catch (error: any) {
        console.error(error);
        if (error.response && error.response.status === 400) {
          message.error('Erro ao Cadastrar a Venda: ' + error.response.data.message);
        } else {
          message.error('Ocorreu um erro ao cadastrar a venda. Tente novamente.');
        }
      }
    }
  };

  const handleDateChange = (date: any) => {
    setDate(date ? dayjs(date).format('YYYY-MM-DD') : null);
  };

  return (
    <NavbarWrapper>
      <Navbar />
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
                  onChange={handleDateChange}
                  required
                  value={date ? dayjs(date, 'YYYY-MM-DD') : null}
                />
                {errors.date && <p style={{ color: 'red' }}>{errors.date}</p>}
              </div>

              <div className='insertTextVenda'style={role === 'user'? oculto : mostrar}>
                <label>Vendedor</label>
                <SelectSeller
                  controlState={[seller, setSeller]}
                  dataKey="cpf"
                />
                {errors.seller && <p style={{ color: 'red' }}>{errors.seller}</p>}
              </div>

              <div className='insertTextVenda'>
                <label>Cliente</label>
                <SelectClient
                  controlState={[client, setClient]}
                  dataKey='cpf'
                  className='selectVendas'
                />
                {errors.client && <p style={{ color: 'red' }}>{errors.client}</p>}
              </div>

              <div className='insertTextVenda'>
                <label>Produto</label>
                <SelectProduct
                  controlState={[product, setProduct]}
                  dataKey='id'
                  className='selectProduct'
                />
                {errors.product && <p style={{ color: 'red' }}>{errors.product}</p>}
              </div>

              <div className='insertTextVenda'>
                <label>Valor da venda</label>
                <InputMask
                  placeholder='R$'
                  mask="R$9999999"
                  maskChar={''}
                  className='inputValor'
                  onChange={e => setValue(e.target.value)}
                  required
                  value={value || ''}
                />
                {errors.value && <p style={{ color: 'red' }}>{errors.value}</p>}
              </div>

              <Button type='primary' className='custom-button' htmlType='submit'>Cadastrar</Button>
            </form>
          </div>
        </div>
      </div>
    </NavbarWrapper>
  );
}
