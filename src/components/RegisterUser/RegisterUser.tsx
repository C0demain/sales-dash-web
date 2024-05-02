import { useState } from 'react'
import './index.css'
import { isValidCPF } from '.'
import { sendData } from '.'
import Navbargest from 'components/AdminNavbar/AdminNavbar'
import NavbarWrapper from 'components/NavbarWrapper/NavbarWrapper'

function RegisterUser() {

  const regex = /^(?=.*[!@#$%^&*()_+{}\]:;<>,.?~])(?=.*[0-9])(?=.*[a-zA-Z]).*$/

  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [senhaConfirm, setSenhaConfirm] = useState('')
  const [cpf, setCpf] = useState('')
  const [funcao, setFuncao] = useState('')
  const [errors, setErrors] = useState({ userName: '', email: '', senhaConfirm: '', cpf: '', funcao: '', senha: '', response: '' })
  const [sucess, setSucess] = useState('')

  const validate = () => {
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

    if (!funcao) {
      errors.funcao = '  Selecione sua função.'
      isValid = false
    }

    if (!senha) {
      errors.senha = 'É obrigatório definir uma senha.'
      isValid = false
    } else if (senha.length < 8) {
      errors.senha = 'A senha deve ter mais de 8 caractéres.'
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
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (validate()) {
      // Lógica de submissão do formulário
      try {
        await sendData(userName, email, cpf, funcao, senha)
        setSucess('Cadastro realizado!')
      } catch (error: any) {
        if (error.response.status === 400) {
          errors.response = 'CPF ou email já está vinculado a outro usuário'
        } else {
          errors.response = 'Ocorreu um erro ao registrar o produto. Tente novamente'
        }
        setErrors(errors)
        console.log(error)
      }
    }
  }

  return (
    <NavbarWrapper>
      <Navbargest />
      <div className='Página'>

        <div className='container'>

          <div className="caixa">
            <h1 className='titulo'>Cadastro de Usuário</h1>

            <form className="formulario" onSubmit={handleSubmit}>
              <div className='insertText'>
                <label>Nome:</label>

                <input type="text" placeholder='  Nome completo' onChange={(e) => setUserName(e.target.value)} required />
                {errors.userName && <p className='erro'>{errors.userName}</p>}
              </div>

              <div className='insertText'>
                <label>CPF do usuário:</label>

                <input type="text" placeholder='  000.000.000-00' onChange={(e) => setCpf(e.target.value)} required />
                {errors.cpf && <p className='erro'>{errors.cpf}</p>}
              </div>

              <div className='insertText'>
                <label>Email do usuário:</label>

                <input type="email" placeholder='  Email' onChange={(e) => setEmail(e.target.value)} required />
                {errors.email && <p className='erro'>{errors.email}</p>}
              </div>

              <div className='insertText'>
                <label>Função do usuário:</label>
                <select title='  Escolha sua função' value={funcao} onChange={(e) => setFuncao(e.target.value)}>
                  <option value="" disabled hidden>  Selecione uma função</option>
                  <option value="user">  Vendedor</option>
                  <option value="admin">  Gestor</option>
                </select>
                {errors.funcao && <p className='erro'>{errors.funcao}</p>}
              </div>

              <div className='senhas'>
                <h4>A senha deve conter:</h4>
                <ol>
                  <li>8 ou mais caractéres.</li>
                  <li>Ao menos 1 número.</li>
                  <li>Ao menos 1 digito especial.</li>
                </ol>
                <div className='inputSenha'>
                  <label >Digite uma senha:</label>
                  <input type="password" name='senha' placeholder='  Senha' required onChange={(e) => setSenha(e.target.value)} />
                  {errors.senha && <p className='erro'>{errors.senha}</p>}
                </div>

                <div className='inputSenha'>
                  <label >Confirme sua senha:</label>
                  <input type="password" placeholder='  Confirme sua senha' required onChange={(e) => setSenhaConfirm(e.target.value)} />
                  {errors.senhaConfirm && <p className='erro'>{errors.senhaConfirm}</p>}
                </div>

              </div>
              {sucess && <p className='funciona'>{sucess}</p>}
              {errors.response && <p className='erro'>{errors.response}</p>}
              <button type='submit'>Cadastrar</button>
            </form>
          </div>
        </div>
      </div>
    </NavbarWrapper>
  )
}

export default RegisterUser;