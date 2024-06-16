import { Button, Input, message } from "antd";
import { useState } from 'react';
import './index.css';
import { sendDataAdmin, sendDataSeller } from '.';
import Navbar from 'components/Navbar/Navbar';
import NavbarWrapper from 'components/NavbarWrapper/NavbarWrapper';
import InputMask from 'react-input-mask';
import { isValidCPF } from "util/validation";

function RegisterUser() {
  const regex = /^(?=.*[!@#$%^&*()_+{}\]:;<>,.?~])(?=.*[0-9])(?=.*[a-zA-Z]).*$/

  //User = Vendedor
  const [nameUser, setNameUser] = useState('');
  const [emailUser, setEmailUser] = useState('');
  const [passwordUser, setPasswordUser] = useState('');
  const [confirmPasswordUser, setConfirmPasswordUser] = useState('');
  const [cpfUser, setCpfUser] = useState('');
  const [loadingSeller, setLoadingSeller] = useState(false);

  //Admin = Gestor
  const [nameAdmin, setNameAdmin] = useState('');
  const [emailAdmin, setEmailAdmin] = useState('');
  const [cpfAdmin, setCpfAdmin] = useState('');
  const [loadingAdmin, setLoadingAdmin] = useState(false);

  const validateFieldsSeller = () => {

    if (nameUser.length < 3) {
      message.error('O nome deve ter mais de 3 caracteres.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(emailUser)) {
      message.error('Email inválido.');
      return false;
    }
    if (cpfUser.length === 14 && !isValidCPF(cpfUser)) {
      message.error('Esse CPF é inválido');
      return false;
    }
    if (passwordUser.length < 8) {
      message.error('A senha deve ter pelo menos 8 caracteres.');
      return false;
    }
    if (!regex.test(passwordUser)) {
      message.error('A senha deve conter pelo menos um número e um caractere especial.');
      return false;
    }
    if (passwordUser !== confirmPasswordUser) {
      message.error('As senhas não coincidem.');
      return false;
    }
    return true;
  }

  const handleSubmitSeller = async (event: any) => {
    event.preventDefault();
    if (validateFieldsSeller()) {
      setLoadingSeller(true);
      try {
        await sendDataSeller(nameUser, emailUser, cpfUser, passwordUser);
        message.success('Vendedor cadastrado com sucesso!');
        setNameUser('');
        setEmailUser('');
        setPasswordUser('');
        setConfirmPasswordUser('');
        setCpfUser('');
      } catch (error : any) {
        if (error.response && error.response.status === 400) {
          message.error('CPF ou email já está vinculado a outro usuário.');
        } else {
          message.error('Ocorreu um erro ao registrar o usuário. Tente novamente.');
        }
      } finally {
        setLoadingSeller(false);
      }
    }
  };

  const validateFieldsAdmin = () => {
    if (nameAdmin.length < 3) {
      message.error('O nome deve ter mais de 3 caracteres.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(emailAdmin)) {
      message.error('Email inválido.');
      return false;
    }
    if (cpfAdmin.length === 14 && !isValidCPF(cpfAdmin)) {
      message.error('Esse CPF é inválido');
      return false;
    }
    return true;
  }

  const handleSubmitAdmin = async (event: any) => {
    event.preventDefault();
    if (validateFieldsAdmin()) {
      setLoadingAdmin(true);
      try {
        await sendDataAdmin(nameAdmin, emailAdmin, cpfAdmin);
        message.success('Gestor cadastrado com sucesso!');
        message.success('Verifique sua caixa de email principal ou o spam.');
        setNameAdmin('');
        setCpfAdmin('');
        setEmailAdmin('');        
      } catch (error: any) {
        if (error.response && error.response.status === 400) {
          message.error('CPF ou email já está vinculado a outro usuário.');
        } else {
          message.error('Ocorreu um erro ao registrar o usuário. Tente novamente.');
        }
      } finally {
        setLoadingAdmin(false);
      }
    }
  };

  return (
    <NavbarWrapper>
      <Navbar />
      <div className='containerGlobal'>
        <div className='containerVendedor'>
          <div className="formContainer">

            {/* Formulário Vendedor */}
            <div className="caixaVendedor">
              <h1 className='titulo'>Cadastro de Vendedor</h1>
              <form className="formularioVendedor" onSubmit={handleSubmitSeller}>
                <div className='insertText'>
                  <label>Nome:</label>
                  <input type="text" placeholder='Nome completo' value={nameUser} onChange={(e) => setNameUser(e.target.value)} required />
                </div>

                <div className='insertText'>
                  <label>CPF do vendedor:</label>
                  <InputMask
                    mask="999.999.999-99"
                    value={cpfUser}
                    onChange={(e) => setCpfUser(e.target.value)}
                    placeholder="000.000.000-00"
                  />
                </div>

                <div className='insertText'>
                  <label>Email do vendedor:</label>
                  <input type="email" placeholder='Email' value={emailUser} onChange={(e) => setEmailUser(e.target.value)} required />
                </div>

                <div className='passwordRules'>
                  <p>A senha deve conter:</p>
                  <ul>
                    <li>Pelo menos 8 caracteres</li>
                    <li>Pelo menos um número</li>
                    <li>Pelo menos um caractere especial (!@#$%^&*)</li>
                  </ul>
                </div>

                <div className='inputSenha'>
                  <label>Digite uma senha:</label>
                  <Input.Password type="password" value={passwordUser} placeholder='Senha' required onChange={(e) => setPasswordUser(e.target.value)} />
                </div>

                <div className='inputSenha'>
                  <label>Confirme sua senha:</label>
                  <Input.Password type="password" value={confirmPasswordUser} placeholder='Confirme sua senha' required onChange={(e) => setConfirmPasswordUser(e.target.value)} />
                </div>

                <Button htmlType='submit' type='primary' className="custom-button" loading={loadingSeller}> Cadastrar </Button>
              </form>
            </div>

            {/* Formulário Gestor */}
            <div className="caixaAdmin">
              <h1 className='titulo'>Cadastro de Gestor</h1>
              <form className="formularioCliente" onSubmit={handleSubmitAdmin}>
                  <div className='insertText'>
                    <label>Nome:</label>
                    <input type="text" placeholder='Nome completo' value={nameAdmin} onChange={(e) => setNameAdmin(e.target.value)} required />
                  </div>

                  <div className='insertText'>
                    <label>CPF do gestor:</label>
                    <InputMask
                      mask="999.999.999-99"
                      value={cpfAdmin}
                      onChange={(e) => setCpfAdmin(e.target.value)}
                      placeholder="000.000.000-00"
                    />
                  </div>

                  <div className='insertText'>
                    <label>Email do gestor:</label>
                    <input type="email" placeholder='Email' value={emailAdmin} onChange={(e) => setEmailAdmin(e.target.value)} required />
                  </div>

                  <Button htmlType="submit" type='primary' className="custom-button" loading={loadingAdmin}>Cadastrar</Button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </NavbarWrapper>
  );
}

export default RegisterUser;
