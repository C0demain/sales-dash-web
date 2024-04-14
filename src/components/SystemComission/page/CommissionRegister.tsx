import { useState } from 'react'
import React from 'react'
import './CommissionRegister.css'
import enviarDadosParaBackend from '../function/enviaDados'
import { Button, Input, InputNumber } from 'antd'
import NavbarWrapper from '../../Barra_lateral/NavbarWrapper/NavbarWrapper'
import Navbargest from '../../Barra_lateral/Barra_lateral_gestor'

function CommissionRegister () {
    const [title, setTitle] = useState<any>('')
    const [percentage, setPercentage] = useState<any>()

    const [errors, setErrors] = useState({title: '', percentage: ''})
    const [sucess, setSucess] = useState('')

    const validate = () => {
        let isValid = true;
        const errors = { title: '', percentage: ''};

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

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validate()) {
            
            enviarDadosParaBackend(title, percentage)
        }
    }

    return (
        <NavbarWrapper>
          <Navbargest/>
          <div className='container systemCommission'>
            <div className="box">
              <h1 className='titulo'>Cadastro Comissão</h1>
              <form className="formulario" onSubmit={handleSubmit}>
              <div className='insertText'>
                <label>Título</label>
                <Input onChange={(e)=> setTitle(e.target.value)}/>
                {errors.title && <p style={{color: 'red'}}>{errors.title}</p>}
              </div>
                <div className='insertText'>
                  <label>Porcentagem</label>
                  <InputNumber placeholder='Digite a porcentagem' onChange={(e: any)=> {setPercentage(parseFloat(e) / 100)}} addonAfter="%" required />
                  {errors.percentage && <p style={{ color: 'red' }}>{errors.percentage}</p>}
                </div>
                  {sucess && <p style={{color: 'green'}}>{sucess}</p>}
                  <button className='botaoEnvia' type='submit'>Cadastrar Comissão</button>
              </form>
            </div>
          </div>
        </NavbarWrapper>
      )
}

export default CommissionRegister 