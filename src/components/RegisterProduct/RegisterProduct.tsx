import { useState } from 'react'
import NavbarWrapper from 'components/NavbarWrapper/NavbarWrapper'
import { sendData } from '.'
import './index.css'
import { Button, message } from 'antd'
import Navbar from 'components/Navbar/Navbar'

function RegisterProduct() {

    const [name, setName] = useState('')
    const [errors, setErrors] = useState({ name: '', description: '', response: '' })
    const [sucess, setSucess] = useState('')

    const validate = () => {
        let isValid = true;
        const errors = { name: '', description: '', value: '', response: '' };

        if (!name) {
            message.error('O nome é obrigatório.')
            isValid = false;
        } else if (name.length < 3) {
            message.error('O nome deve ter mais de 3 caracteres.')
            isValid = false;
        }

        setErrors(errors)
        return isValid;
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validate()) {
            // Lógica de submissão do formulário
            try {
                await sendData(name);
                message.success('Produto Cadastrado com Sucesso!');
                setName('');
            } catch (error: any) {
                message.error('Ocorreu um erro ao registrar o produto. Tente novamente');
                setErrors(errors);
                console.log(error);
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

                                    <input placeholder="  Nome" type="text" onChange={(e) => setName(e.target.value)} required />
                                    {errors.name && <p className='erro'>{errors.name}</p>}
                                </div>

                        

                                {sucess && <p className='funciona'>{sucess}</p>}
                                {errors.response && <p className='erro'>{errors.response}</p>}
                                <Button type='primary' htmlType='submit' className='custom-button'>Cadastrar</Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </NavbarWrapper>
    )
}

export default RegisterProduct