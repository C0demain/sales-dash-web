import React from 'react'
import { useState } from 'react'
import {sendData} from './index'
import {isValidCPF} from './index'
import './index.css'
import NavbarWrapper from 'components/NavbarWrapper/NavbarWrapper'
import Navbargest from 'components/AdminNavbar/AdminNavbar'

function RegisterClient() {
  
  const [clientName, setClientName] = useState('')
  const [segment, setSegment] = useState('')
  const [cpf, setCpf] = useState('')
  const [errors, setErrors] = useState({ clientName: '', segment: '', cpf: '', response: ''})
  const [sucess, setSucess] = useState('')

  const validate = () => {
    let isValid = true;
    const errors = { clientName: '', segment: '', cpf: '', response: '' };

    if (!clientName) {
      errors.clientName = 'O nome é obrigatório.';
      isValid = false;
    } else if (clientName.length < 3) {
      errors.clientName = 'O nome deve ter mais de 3 caracteres.';
      isValid = false;
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
      try{
        await sendData(clientName, segment, cpf)
        setSucess('Cadastro realizado!')
      }catch(error: any){
        if(error.response.status == 400){
          errors.response = 'Esse CPF/CNPJ já está vinculado a outro cliente'
        }else {
          errors.response = 'Ocorreu um erro ao registrar o cliente. Tente novamente'
          console.log(error)
        }
        setErrors(errors)
      }
    }
  }

  return (
    <NavbarWrapper>
      <Navbargest />

        <div className='Página'>

          <div className='container'>

          <div className="caixa">
            <h1 className='titulo'>Cadastro de Cliente</h1>

            <form className="formulario" id="form" onSubmit={handleSubmit}>
              <div className='insertText'>
                <label>Nome:</label>

                <input type="text" placeholder='  Nome completo' onChange={(e) => setClientName(e.target.value)} required />
                {errors.clientName && <p className='erro'>{errors.clientName}</p>}
              </div>

              <div className='insertText'>
                <label>Segmento do Cliente:</label>

                <input type="text" placeholder='  Ex: Contábil, Marketing' onChange={(e) => setSegment(e.target.value)} required />
                {errors.segment && <p className='erro'>{errors.segment}</p>}
              </div>

              <div className='insertText'>
                <label>CPF/CNPJ do Cliente:</label>

                <input type="text" placeholder='  000.000.000-00' onChange={(e) => setCpf(e.target.value)} required />
                {errors.cpf && <p className='erro'>{errors.cpf}</p>}
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

export default RegisterClient
