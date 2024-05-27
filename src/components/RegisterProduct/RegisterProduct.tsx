import { useState } from 'react'
import NavbarWrapper from 'components/NavbarWrapper/NavbarWrapper'
import { sendData } from '.'
import './index.css'
import { message } from 'antd'
import Navbar from 'components/Navbar/Navbar'

function RegisterProduct() {

    const [productName, setProductName] = useState('')
    const [description, setDescription] = useState('')
    const [errors, setErrors] = useState({ productName: '', description: '', value: '', response: '' })
    const [sucess, setSucess] = useState('')

    const validate = () => {
        let isValid = true;
        const errors = { productName: '', description: '', value: '', response: '' };

        if (!productName) {
            message.error('O nome é obrigatório.')
            isValid = false;
        } else if (productName.length < 3) {
            message.error('O nome deve ter mais de 3 caracteres.')
            isValid = false;
        }

        if (!description) {
            message.error('Adicione uma descrição para o produto.')
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
                await sendData(productName, description)
                message.success('Cadastro realizado!')
            } catch (error: any) {
                message.error('Ocorreu um erro ao registrar o produto. Tente novamente')
                setErrors(errors)
                console.log(error)
            }
        }
    }

    return (
        <NavbarWrapper>
            <Navbar />
            <div className='Página'>
                <div className="containerGlobal">
                    <div className='containerRegisterProduct'>
                        <div className='caixa'>
                            <h1 className='titulo'>Cadastro de Produto</h1>

                            <form className="formulario" onSubmit={handleSubmit}>
                                <div className='insertText'>
                                    <label>Nome do produto:</label>

                                    <input placeholder="  Nome" type="text" onChange={(e) => setProductName(e.target.value)} required />
                                    {errors.productName && <p className='erro'>{errors.productName}</p>}
                                </div>

                                <div className='insertText'>
                                    <label>Descrição</label>

                                    <input placeholder="  Descreva o produto" type="text" onChange={(e) => setDescription(e.target.value)} required />
                                    {errors.description && <p className='erro'>{errors.description}</p>}
                                </div>

                                {sucess && <p className='funciona'>{sucess}</p>}
                                {errors.response && <p className='erro'>{errors.response}</p>}
                                <button type='submit' className='botaoCadastrar'>Cadastrar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </NavbarWrapper>
    )
}

export default RegisterProduct