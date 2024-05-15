import React, { useState } from 'react';
import { sendData } from './index';
import './index.css';
import NavbarWrapper from 'components/NavbarWrapper/NavbarWrapper';
import Navbargest from 'components/AdminNavbar/AdminNavbar';
import message from 'antd/es/message';

function RegisterClient() {
  const [clientName, setClientName] = useState('');
  const [segment, setSegment] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [response, setResponse] = useState('');
  const [success, setSuccess] = useState('');

  const validate = () => {
    let isValid = true;

    if (!clientName || clientName.length < 3) {
      message.error('O nome é obrigatório e deve ter mais de 3 caracteres.');
      isValid = false;
    } else if (!cpfCnpj || cpfCnpj.length !== 14 && cpfCnpj.length !== 18) {
      message.error('O CPF/CNPJ é inválido.');
      isValid = false;
    } else {
      setResponse('');
    }

    return isValid;
  };

  const formatCPF = (value: string) => {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return value;
  };

  const formatCNPJ = (value: string) => {
    value = value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
    return value;
  };

  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      setCpfCnpj(formatCPF(value));
    } else {
      setCpfCnpj(formatCNPJ(value));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validate()) {
      try {
        await sendData(clientName, segment, cpfCnpj);
        message.success('Cliente atualizado com sucesso!');
      } catch (error: any) {
        if (error.response && error.response.status === 400) {
          message.error('Esse CPF/CNPJ já está vinculado a outro cliente.');
        } else {
          message.error('Ocorreu um erro ao registrar o cliente. Tente novamente.');
          console.log(error);
        }
      }
    }
  };

  return (
    <NavbarWrapper>
      <Navbargest />
      <div className="Página">
        <div className="container">
          <div className="caixa">
            <h1 className="titulo">Cadastro de Cliente</h1>
            <form className="formulario" id="form" onSubmit={handleSubmit}>
              <div className="insertText">
                <label>Nome:</label>
                <input type="text" placeholder="Nome completo" onChange={(e) => setClientName(e.target.value)} required />
              </div>
              <div className="insertText">
                <label>Segmento do Cliente:</label>
                <input type="text" placeholder="Ex: Contábil, Marketing" onChange={(e) => setSegment(e.target.value)} required />
              </div>
              <div className="insertText">
                <label>CPF/CNPJ do Cliente:</label>
                <input type="text" placeholder="000.000.000-00 ou 00.000.000/0000-00" value={cpfCnpj} onChange={handleCpfCnpjChange} required />
              </div>
              {success && <p className="funciona">{success}</p>}
              {response && <p className="erro">{response}</p>}
              <button type="submit">Cadastrar</button>
            </form>
          </div>
        </div>
      </div>
    </NavbarWrapper>
  );
}

export default RegisterClient;
function setOpen(arg0: boolean) {
  throw new Error('Function not implemented.');
}

