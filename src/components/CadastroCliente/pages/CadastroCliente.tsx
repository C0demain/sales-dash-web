import { useState } from 'react'
import './CadastroCliente.css'
import isValidCPF from '../functions/validarCPF'
import enviarDadosParaBackend from '../functions/enviaDados'
import Navbargest from '../../Barra_lateral/Barra_lateral_gestor'
import NavbarWrapper from '../../Barra_lateral/NavbarWrapper/NavbarWrapper'

function CadastroCliente() {

  const regex = /^(?=.*[!@#$%^&*()_+{}\]:;<>,.?~])(?=.*[0-9])(?=.*[a-zA-Z]).*$/

  const [clientName, setClientName] = useState('')
  const [segment, setSegment] = useState('')
  const [cpf, setCpf] = useState('')
  const [errors, setErrors] = useState({ clientName: '', segment: '', cpf: '' })
  const [sucess, setSucess] = useState('')

  const validate = () => {
    let isValid = true;
    const errors = { clientName: '', segment: '', cpf: '' };

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
  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (validate()) {
      // Lógica de submissão do formulário
      setSucess('Cadastro realizado!')
      enviarDadosParaBackend(clientName, segment, cpf)
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

                <input type="text" placeholder='Nome completo' onChange={(e) => setClientName(e.target.value)} required />
                {errors.clientName && <p className='erro'>{errors.clientName}</p>}
              </div>

              <div className='insertText'>
                <label>Segmento do Cliente:</label>

                <input type="text" placeholder='Ex: Contábil, Marketing' onChange={(e) => setSegment(e.target.value)} required />
                {errors.segment && <p className='erro'>{errors.segment}</p>}
              </div>

              <div className='insertText'>
                <label>CPF/CNPJ do Cliente:</label>

                <input type="text" placeholder='000.000.000-00' onChange={(e) => setCpf(e.target.value)} required />
                {errors.cpf && <p className='erro'>{errors.cpf}</p>}
              </div>

              {sucess && <p className='funciona'>{sucess}</p>}
              <button type='submit'>Cadastrar</button>
            </form>
          </div>
        </div>
      </div>
    </NavbarWrapper>
  )
}

export default CadastroCliente
