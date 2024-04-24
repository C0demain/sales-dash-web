import { useState } from 'react'
import NavbarWrapper from 'components/NavbarWrapper/NavbarWrapper'
import Navbargest from 'components/AdminNavbar/AdminNavbar'
import { sendData } from '.'
import './index.css'

function CadastroProduto() {

  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')
  const [value, setValue] = useState('')
  const [errors, setErrors] = useState({ productName: '', description: '', value: ''})
  const [sucess, setSucess] = useState('')

  const validate = () => {
    let isValid = true;
    const errors = { productName: '', description: '', value: ''};

    if (!productName) {
      errors.productName = 'O nome é obrigatório.';
      isValid = false;
    } else if (productName.length < 3) {
      errors.productName = 'O nome deve ter mais de 3 caracteres.';
      isValid = false;
    }

    if (!description) {
      errors.description = 'Adicione uma descrição para o produto.'
      isValid = false
    }

    if(!value){
      errors.value = 'Insira um preço para o produto!'
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
      sendData(productName, description, parseFloat(value))
    }
  }

  return (
    <NavbarWrapper>
      <Navbargest />
      <div className='Página'>

        <div className='container'>

          <div className="caixa">
            <h1 className='titulo'>Cadastro de Produto</h1>

            <form className="formulario" onSubmit={handleSubmit}>
              <div className='insertText'>
                <label>Nome do produto:</label>

                <input placeholder="Nome" type="text" onChange={(e) => setProductName(e.target.value)} required />
                {errors.productName && <p className='erro'>{errors.productName}</p>}
              </div>

              <div className='insertText'>
                <label>Descrição</label>

                <input placeholder="Descreva o produto" type="text" onChange={(e) => setDescription(e.target.value)} required />
                {errors.description && <p className='erro'>{errors.description}</p>}
              </div>

              <div className='insertText'>
                <label>Preço:</label>

                <input placeholder="Preço R$" type="number" min="0" onChange={(e) => setValue(e.target.value)} required />
                {errors.value && <p className='erro'>{errors.value}</p>}
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

export default CadastroProduto
