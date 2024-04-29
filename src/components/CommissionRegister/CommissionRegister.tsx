import { useState } from 'react'
import './index.css'
import { enviarDadosParaBackend } from '.'
import { Input, InputNumber } from 'antd'
import NavbarWrapper from 'components/NavbarWrapper/NavbarWrapper'
import Navbargest from 'components/AdminNavbar/AdminNavbar'
import { useNavigate } from 'react-router-dom'

export default function CommissionRegister() {
  const [title, setTitle] = useState<any>('')
  const [percentage, setPercentage] = useState<any>()

  const [errors, setErrors] = useState({ title: '', percentage: '' })
  const [sucess, setSucess] = useState('')

  const validate = () => {
    let isValid = true;
    const errors = { title: '', percentage: '' };

    if (!title) {
      errors.title = 'O título é obrigatório.';
      isValid = false;
    }

    if (!percentage) {
      errors.percentage = 'A porcentagem é obrigatória.';
      isValid = false;
    }

    setSucess('Cadastro realizado!')
    setErrors(errors)
    return isValid
  }

  const navigate = useNavigate();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (validate()) {
      enviarDadosParaBackend(title, percentage);
      navigate('/commissions');
    }
    navigate('/commissions')
  }

  return (
    <NavbarWrapper>
      <Navbargest />
      <div className='Página'>
        <div className='container'>
          <div className="caixa">
            <h1 className='titulo'>Cadastro Comissão</h1>
            <form className="formulario" onSubmit={handleSubmit}>
              
              <div className='insertText'>
                <label>Título</label>
                <Input
                  placeholder="Digite o título" 
                  onChange={(e) => setTitle(e.target.value)}
                />
                {errors.title && <p style={{ color: 'red' }}>{errors.title}</p>}
              </div>

              <div className='insertText'>
                <label>Porcentagem</label>
                <InputNumber 
                  placeholder='Digite a porcentagem' 
                  onChange={(e: any) => { setPercentage(parseFloat(e) / 100) }} addonAfter="%" required 
                />
                {errors.percentage && <p style={{ color: 'red' }}>{errors.percentage}</p>}
              </div>

              {sucess && <p style={{ color: 'green' }}>{sucess}</p>}
              <div className='buttonWrapper'>
                  <button onClick={e => handleSubmit(e)} className='buttonSend'>Voltar</button>
                  <button className='buttonSend' type='submit'>Cadastrar</button>
              </div>
        
            </form>
          </div>
        </div>
      </div>
    </NavbarWrapper>
  )
} 