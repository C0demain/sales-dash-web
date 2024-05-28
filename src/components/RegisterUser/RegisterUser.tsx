import { Input, Spin, message } from "antd";
import { useState } from 'react';
import './index.css';
import { isValidCPF, sendDataAdmin, sendDataSeller } from '.';
import Navbar from 'components/Navbar/Navbar';
import NavbarWrapper from 'components/NavbarWrapper/NavbarWrapper';
import InputMask from 'react-input-mask';

function RegisterUser() {

  const regex = /^(?=.*[!@#$%^&*()_+{}\]:;<>,.?~])(?=.*[0-9])(?=.*[a-zA-Z]).*$/

  // States para o formulário de vendedor
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [senhaConfirm, setSenhaConfirm] = useState('')
  const [cpf, setCpf] = useState('')
  const [errors, setErrors] = useState({ userName: '', email: '', senhaConfirm: '', cpf: '', funcao: '', senha: '', response: '' })
  const [success, setSuccess] = useState('');
  const [loadingSeller, setLoadingSeller] = useState(false);

  // States para o formulário de administrador
  const [userNameAdmin, setUserNameAdmin] = useState('');
  const [emailAdmin, setEmailAdmin] = useState('');
  const [cpfAdmin, setCpfAdmin] = useState('');
  const [errorsAdmin, setErrorsAdmin] = useState({ userName: '', email: '', cpf: '', response: '' })
  const [successAdmin, setSuccessAdmin] = useState('');
  const [loadingAdmin, setLoadingAdmin] = useState(false);

  // Validação do formulário de vendedor
  const validateSeller = () => {
    let isValid = true;
    const errors = { userName: '', email: '', senhaConfirm: '', cpf: '', funcao: '', senha: '', response: '' };

    if (!userName) {
      errors.userName = 'O nome é obrigatório.';
      isValid = false;
    } else if (userName.length < 3) {
      errors.userName = 'O nome deve ter mais de 3 caracteres.';
      isValid = false;
    }

    if (!email) {
      errors.email = 'O email é obrigatório.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email inválido.';
      isValid = false;
    }

    if (!senha) {
      errors.senha = 'É obrigatório definir uma senha.'
      isValid = false
    } else if (senha.length < 8) {
      errors.senha = 'A senha deve ter mais de 8 caracteres.'
      isValid = false
    } else if (!regex.test(senha)) {
      errors.senha = 'A senha não atende aos requisitos.'
      isValid = false
    }

    if (!senhaConfirm) {
      errors.senhaConfirm = 'É obrigatório ter e confirmar uma senha.'
      isValid = false
    } else if (senha !== senhaConfirm) {
      errors.senhaConfirm = 'As duas senhas devem ser iguais'
      isValid = false
    }

    if (!cpf) {
      errors.cpf = 'É obrigatório confirmar um CPF.'
      isValid = false
    } else if (isValidCPF(cpf)) {
      errors.cpf = 'Esse CPF é inválido'
      isValid = false
    }

    setErrors(errors)
    return isValid
  }

  // Validação do formulário de administrador
  const validateAdmin = () => {
    let isValid = true;
    const errorsAdmin = { userName: '', email: '', cpf: '', response: '' };

    if (!userNameAdmin) {
      errorsAdmin.userName = 'O nome é obrigatório.';
      isValid = false;
    } else if (userNameAdmin.length < 3) {
      errorsAdmin.userName = 'O nome deve ter mais de 3 caracteres.';
      isValid = false;
    }

    if (!emailAdmin) {
      errorsAdmin.email = 'O email é obrigatório.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(emailAdmin)) {
      errorsAdmin.email = 'Email inválido.';
      isValid = false;
    }

    if (!cpfAdmin) {
      errorsAdmin.cpf = 'É obrigatório confirmar um CPF.';
      isValid = false;
    } else if (isValidCPF(cpfAdmin)) {
      errorsAdmin.cpf = 'Esse CPF é inválido';
      isValid = false;
    }

    setErrorsAdmin(errorsAdmin)
    return isValid
  }
  const handleSubmitSeller = async (event: any) => {
    event.preventDefault();
    if (validateSeller()) {
      setLoadingSeller(true);
      try {
        await sendDataSeller(userName, email, cpf, senha);
        message.success('Vendedor cadastrado com sucesso!');
      } catch (error: any) {
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

  const handleSubmitAdmin = async (event: any) => {
    event.preventDefault();
    if (validateAdmin()) {
      setLoadingAdmin(true);
      try {
        await sendDataAdmin(userNameAdmin, emailAdmin, cpfAdmin);
        message.success('Gestor cadastrado com sucesso!');
        message.success('Verifique sua caixa de email principal ou o spam.');
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
                  <input type="text" placeholder='Nome completo' onChange={(e) => setUserName(e.target.value)} required />
                </div>

                <div className='insertText'>
                  <label>CPF do vendedor:</label>
                  <InputMask
                    mask="999.999.999-99"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="000.000.000-00"
                  />
                </div>

                <div className='insertText'>
                  <label>Email do vendedor:</label>
                  <input type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className='passwordRules'>
                  <p>A nova senha deve conter:</p>
                  <ul>
                    <li>Pelo menos 8 caracteres</li>
                    <li>Pelo menos um número</li>
                    <li>Pelo menos um caractere especial (!@#$%^&*)</li>
                  </ul>
                </div>

                <div className='inputSenha'>
                  <label>Digite uma senha:</label>
                  <Input.Password type="password" name='senha' placeholder='Senha' required onChange={(e) => setSenha(e.target.value)} />
                </div>

                <div className='inputSenha'>
                  <label>Confirme sua senha:</label>
                  <Input.Password type="password" placeholder='Confirme sua senha' required onChange={(e) => setSenhaConfirm(e.target.value)} />
                </div>

                <button type='submit' className="botaoCadastrar">Cadastrar</button>
              </form>
            </div>

            {/* Formulário Gestor */}
            <div className="caixaAdmin">
              <h1 className='titulo'>Cadastro de Gestor</h1>
              <form className="formularioCliente" onSubmit={handleSubmitAdmin}>
                <Spin spinning={loadingAdmin}>
                  <div className='insertText'>
                    <label>Nome:</label>
                    <input type="text" placeholder='Nome completo' onChange={(e) => setUserNameAdmin(e.target.value)} required />
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
                    <input type="email" placeholder='Email' onChange={(e) => setEmailAdmin(e.target.value)} required />
                  </div>

                  <button type='submit' className="botaoCadastrar">Cadastrar</button>
                </Spin>
              </form>
            </div>

          </div>
        </div>
      </div>
    </NavbarWrapper>
  );
}

export default RegisterUser;
