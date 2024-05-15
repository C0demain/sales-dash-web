import React, { useState } from 'react';
import { sendData } from './index';
import './index.css';
import NavbarWrapper from 'components/NavbarWrapper/NavbarWrapper';
import Navbargest from 'components/AdminNavbar/AdminNavbar';
import message from 'antd/es/message';

// Função para validar CPF
const isValidCPF = (cpf: string) => {
  if (typeof cpf !== "string") return false;
  cpf = cpf.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
  if (cpf.length !== 11) return false;
  let sum = 0;
  let mod;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  mod = sum % 11;
  if (mod === 0 || mod === 1) {
    if (parseInt(cpf.charAt(9)) !== 0) return false;
  } else {
    if (parseInt(cpf.charAt(9)) !== 11 - mod) return false;
  }
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  mod = sum % 11;
  if (mod === 0 || mod === 1) {
    if (parseInt(cpf.charAt(10)) !== 0) return false;
  } else {
    if (parseInt(cpf.charAt(10)) !== 11 - mod) return false;
  }
  return true;
};

// Função para validar CNPJ
const isValidCNPJ = (cnpj: string) => {
  if (typeof cnpj !== "string") return false;
  cnpj = cnpj.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
  if (cnpj.length !== 14) return false;
  let sum = 0;
  let mod;
  let weight = 2;
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  mod = sum % 11;
  if (mod < 2) {
    if (parseInt(cnpj.charAt(12)) !== 0) return false;
  } else {
    if (parseInt(cnpj.charAt(12)) !== 11 - mod) return false;
  }
  sum = 0;
  weight = 2;
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  mod = sum % 11;
  if (mod < 2) {
    if (parseInt(cnpj.charAt(13)) !== 0) return false;
  } else {
    if (parseInt(cnpj.charAt(13)) !== 11 - mod) return false;
  }
  return true;
};

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
    const value = e.target.value;
    const formattedValue = value
      .replace(/\D/g, '') // Remove caracteres não numéricos
      .replace(/(\d{3})(\d)/, '$1.$2') // Insere ponto após o terceiro dígito
      .replace(/(\d{3})(\d)/, '$1.$2') // Insere ponto após o sexto dígito
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Insere hífen após o nono dígito ou o segundo dígito verificador
    setCpfCnpj(formattedValue);
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
                <input type="text" placeholder="000.000.000-00 ou 00.000.000/0000-00" value={cpfCnpj} onChange={(e) => setCpfCnpj(e.target.value)} required />
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
