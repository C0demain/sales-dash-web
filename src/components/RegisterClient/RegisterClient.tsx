import React, { useState } from 'react';
import { sendData } from './index';
import './index.css';
import NavbarWrapper from 'components/NavbarWrapper/NavbarWrapper';
import Navbar from 'components/Navbar/Navbar';
import message from 'antd/es/message';
import InputMask from 'react-input-mask';
import { isValidCNPJ, isValidCPF } from 'util/validation';
import { Button } from 'antd';
import Switch from '@mui/material/Switch';

function RegisterClient() {
  const [clientName, setClientName] = useState('');
  const [segment, setSegment] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [response, setResponse] = useState('');
  const [isCpf, setIsCpf] = useState(true);
  const [loading, setLoading] = useState(false);

  const toggleIsCpf = () => {
    setIsCpf(!isCpf);
    setCpfCnpj('');
  };

  const validate = () => {
    let isValid = true;

    if (!clientName || clientName.length < 3) {
      message.error('O nome é obrigatório e deve ter mais de 3 caracteres.');
      isValid = false;
    } else if (!cpfCnpj || (cpfCnpj.length !== 14 && cpfCnpj.length !== 18)) {
      message.error('O CPF/CNPJ é inválido.');
      isValid = false;
    } else if (cpfCnpj.length === 14 && !isValidCPF(cpfCnpj)) {
      message.error('O CPF é inválido.');
      isValid = false;
    } else if (cpfCnpj.length === 18 && !isValidCNPJ(cpfCnpj)) {
      message.error('O CNPJ é inválido.');
      isValid = false;
    } else {
      setResponse('');
    }

    return isValid;
  };

  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, '');
    const isCpf = value.length <= 11;
    const mask = isCpf ? '999.999.999-99' : '99.999.999/9999-99';
    let formattedValue = '';

    let i = 0;
    let j = 0;

    while (i < value.length && j < mask.length) {
      if (mask[j] === '9') {
        formattedValue += value[i];
        i++;
      } else {
        formattedValue += mask[j];
      }
      j++;
    }

    setCpfCnpj(formattedValue);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();
    if (validate()) {
      try {
        await sendData(clientName, segment, cpfCnpj);
        message.success('Cliente cadastrado com sucesso!');
        setClientName('');
        setSegment('');
        setCpfCnpj('');
      } catch (error: any) {
        if (error.response && error.response.status === 400) {
          message.error('Esse CPF/CNPJ já está vinculado a outro cliente ou usuário. Tente Outro.');
        } else {
          message.error('Ocorreu um erro ao registrar o cliente. Tente novamente.');
          console.log(error);
        }
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <NavbarWrapper>
      <Navbar />
      <div className="containerGlobal">
        <div className="containerRegisterClient">
          <div className="caixaCliente">
            <h1 className="titulo">Cadastro de Cliente</h1>
            <form className="formularioCliente" id="form" onSubmit={handleSubmit}>

              <div className="insertText">
                <label>Nome:</label>
                <input type="text" placeholder="Nome completo" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
              </div>

              <div className="insertText">
                <label>Segmento do Cliente:</label>
                <input type="text" placeholder="Ex: Contábil, Marketing" value={segment} onChange={(e) => setSegment(e.target.value)} required />
              </div>

              <div className="insertText">
              <label>{isCpf ? 'CPF' : 'CNPJ'} do Cliente:</label>
                <InputMask
                  mask={isCpf ? '999.999.999-99' : '99.999.999/9999-99'}
                  placeholder={isCpf ? '000.000.000-00' : '00.000.000/0000-00'}
                  value={cpfCnpj}
                  onChange={handleCpfCnpjChange}
                  required
                />
              </div>

              <div className="toggle">
                <span className='cor'>CNPJ</span>
                <Switch checked={isCpf} onChange={toggleIsCpf}/>
                <span className='cor'>CPF</span>
              </div>

              <Button type='primary' htmlType="submit" className='custom-button' loading={loading}>Cadastrar</Button>
            </form>
          </div>
        </div>
      </div>
    </NavbarWrapper>
  );
}

export default RegisterClient;