import { useState } from 'react'
import React from 'react'
import './SystemComission.css'
import enviarDadosParaBackend from '../function/enviaDados'

function SystemComission () {
    const [title, setTitle] = useState('')
    const [percentage, setPercentage] = useState('')

    const [errors, setErrors] = useState({Title: '', percentage: ''})

    const validate = () => {
        let isValid = true;
        const errors = { Title: '', percentage: ''};

        if (!title) {
            errors.Title = 'O título é obrigatório.';
            isValid = false;

        if (!percentage) {
            errors.percentage = 'O email é obrigatório.';
            isValid = false;
        } 
        }

        setErrors(errors)
        return isValid
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validate()) {
            // Lógica de submissão do formulário
            
            enviarDadosParaBackend(title, percentage)
        }
    }

    return (
        <div className='container'>
    
          <div className="box">
            <h1 className='titulo'>Cadastro Comissão</h1>
    
            <form className="formulario" onSubmit={handleSubmit}>
              <div className='insertText'>
                <label>Título:</label>
    
                <input type="text" placeholder='Comissão' onChange={(e)=> setTitle(e.target.value)} required/>
                {errors.Title && <p style={{ color: 'red' }}>{errors.Title}</p>}
              </div>
    
              <div className='insertText'>
                <label>percentage do usuário:</label>
    
                <input type="text" placeholder='X%' onChange={(e)=> setPercentage(e.target.value)} required />
                {errors.percentage && <p style={{ color: 'red' }}>{errors.percentage}</p>}
              </div>
                <button className='botaoEnvia' type='submit'>Cadastrar</button>
            </form>
          </div>
        </div>
      )
}

export default SystemComission 