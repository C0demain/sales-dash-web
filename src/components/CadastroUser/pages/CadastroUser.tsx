import { useState } from 'react'
import React from 'react'
import './CadastroUser.css'
import isValidCPF from '../functions/validarCPF'
import enviarDadosParaBackend from '../functions/enviaDados'

function CadastroUser() {

  const regex = /^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~])(?=.*[0-9])(?=.*[a-zA-Z]).*$/

  const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [senhaConfirm, setSenhaConfirm] = useState('')
    const [cpf, setCpf] = useState('')
    const [funcao, setFuncao] = useState('')
    const [errors, setErrors] = useState({userName: '', email: '', senhaConfirm: '', cpf: '', funcao: '', senha:''})

    const validate = () => {
        let isValid = true;
        const errors = { userName: '', email: '', senhaConfirm: '', cpf: '', funcao: '', senha: ''};

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

        if (!senha){
          errors.senha = 'É obrigatório definir uma senha.'
          isValid = false
        }else if(senha.length<8){
          errors.senha = 'A senha deve ter mais de 8 caractéres.'
          isValid = false
        }else if(!regex.test(senha)){
          errors.senha = 'A senha não atende aos requisitos.'
          isValid = false
        }

        if (!senhaConfirm){
            errors.senhaConfirm = 'É obrigatório ter e confirmar uma senha.'
            isValid = false
        }else if (senha!=senhaConfirm){
          errors.senhaConfirm = 'As duas senhas devem ser iguais'
          isValid = false
        }

        if(!cpf){
            errors.cpf = 'É obrigatório confirmar um CPF.'
            isValid = false
        }  else if(isValidCPF(cpf)){
            errors.cpf = 'Esse CPF é inválido'
            isValid = false
        } 

        setErrors(errors)
        return isValid
    }
    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validate()) {
            // Lógica de submissão do formulário
            
            enviarDadosParaBackend(userName, email, cpf, funcao, senhaConfirm)
        }
    }

  return (
    <div className='container'>
      <h1 className='titulo'>Cadastro de Usuário</h1>

      <div className="box">
        <form onSubmit={handleSubmit}>

          <div className='insertText'>
            <label>Nome do usuário:</label>

            <input type="text" placeholder='UserName' onChange={(e)=> setUserName(e.target.value)} required/>
            {errors.userName && <p style={{ color: 'red' }}>{errors.userName}</p>}
          </div>

          <div className='insertText'>
            <label>CPF do usuário:</label>

            <input type="text" placeholder='Cpf' onChange={(e)=> setCpf(e.target.value)} required />
            {errors.cpf && <p style={{ color: 'red' }}>{errors.cpf}</p>}
          </div>

          <div className='insertText'>
            <label>Email do usuário:</label>

            <input type="email" placeholder='Email' onChange={(e)=> setEmail(e.target.value)} required />
            {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
          </div>

          <div className='insertText'>
            <label>Função</label>
            <select title='Escolha sua função' value={funcao} onChange={(e)=> setFuncao(e.target.value)}>
              <option value="">Escolha sua função</option>
              <option value="user">Vendedor</option>
              <option value="admin">Gestor</option>
            </select>
          </div>

          <div className='senhas'>
            <h3>A senha deve conter:</h3>
            <ol>
              <li>8 ou mais caractéres.</li>
              <li>Ao menos 1 número.</li>
              <li>Ao menos 1 digito especial.</li>
            </ol>

            <label >Digite uma senha:</label>
            <input type="password" name='senha' placeholder='Senha' required onChange={(e) => setSenha(e.target.value)}/>
            {errors.senha && <p style={{color: 'red'}}>{errors.senha}</p>}

            <label >Confirme sua senha:</label>
            <input type="password" placeholder='Confirme sua senha' required onChange={(e)=> setSenhaConfirm(e.target.value)}/>
            {errors.senhaConfirm && <p style={{ color: 'red' }}>{errors.senhaConfirm}</p>}
          </div>

          <div className='botaoEnvia'>
            <button type='submit'>Cadastrar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CadastroUser