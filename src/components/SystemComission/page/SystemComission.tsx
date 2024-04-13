import { useState } from 'react'
import React from 'react'
import './SystemComission.css'
import enviarDadosParaBackend from '../function/enviaDados'

function SystemComission () {
    const [title, setTitle] = useState('')
    const [percentage, setPercentage] = useState('')

    const [errors, setErrors] = useState({Title: '', percentage: ''})
    const [sucess, setSucess] = useState('')

    const validate = () => {
        let isValid = true;
        const errors = { Title: '', percentage: ''};

        if (typeof title != "string") {
          errors.Title = 'O título deve ser do tipo texto.';
          isValid = false;

        if (!title) {
            errors.Title = 'O título é obrigatório.';
            isValid = false;
        }    

        if (!percentage) {
            errors.percentage = 'A porcentagem é obrigatória.';
            isValid = false;
        } 
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
        <div className='container systemCommission'>
    
          <div className="box">
            <h1 className='titulo'>Cadastro Comissão</h1>
    
            <form className="formulario" onSubmit={handleSubmit}>
            <div className='insertText'>
              <select title='Escolha sua função' value={title} onChange={(e)=> setTitle(e.target.value)}>
                <option value="">Escolha o tipo de comissão</option>
                <option value="Produto novo cliente novo">Produto novo cliente novo</option>
                <option value="Produto novo cliente velho">Produto novo cliente velho</option>
                <option value="Produto velho cliente novo">Produto velho cliente novo</option>
                <option value="Produto velho cliente velho">Produto velho cliente velho</option>
              </select>
              {errors.Title && <p style={{color: 'red'}}>{errors.Title}</p>}
            </div>
    
              <div className='insertText'>
                <label>Valor da venda:</label>
    
                <input type="text" placeholder='Digite o valor da venda' onChange={(e)=> setPercentage(e.target.value)} required />
                {errors.percentage && <p style={{ color: 'red' }}>{errors.percentage}</p>}
              </div>
                {sucess && <p style={{color: 'green'}}>{sucess}</p>}
                <button className='botaoEnvia' type='submit'>Cadastrar Comissão</button>
            </form>
          </div>
        </div>
      )
}

export default SystemComission 