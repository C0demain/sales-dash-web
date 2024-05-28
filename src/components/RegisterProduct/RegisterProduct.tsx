import React, { useState } from 'react';
import NavbarWrapper from 'components/NavbarWrapper/NavbarWrapper';
import { sendData } from '.';
import './index.css';
import { message } from 'antd';
import Navbar from 'components/Navbar/Navbar';

const RegisterProduct: React.FC = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState<{ name: string; description: string; response: string }>({ name: '', description: '', response: '' });
    const [success, setSuccess] = useState('');

    const validate = (): boolean => {
        let isValid = true;
        const errors = { name: '', description: '', response: '' };

        if (!name) {
            errors.name = 'O nome é obrigatório.';
            isValid = false;
        } else if (name.length < 3) {
            errors.name = 'O nome deve ter mais de 3 caracteres.';
            isValid = false;
        }

        if (!description) {
            errors.description = 'Adicione uma descrição para o produto.';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({ name: '', description: '', response: '' });
        if (validate()) {
            try {
                await sendData(name, description);
                setSuccess('Cadastro realizado com sucesso!');
                message.success('Cadastro realizado!');
                setName('');
                setDescription('');
            } catch (error: any) {
                console.error('Erro ao registrar o produto:', error);
                setErrors({ ...errors, response: 'Ocorreu um erro ao registrar o produto. Tente novamente' });
                message.error('Ocorreu um erro ao registrar o produto. Tente novamente');
            }
        }
    };

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
                                    <input
                                        placeholder="Nome"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className='erro'>{errors.name}</p>}
                                </div>
                                <div className='insertText'>
                                    <label>Descrição</label>
                                    <input
                                        placeholder="Descreva o produto"
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    />
                                    {errors.description && <p className='erro'>{errors.description}</p>}
                                </div>
                                {success && <p className='funciona'>{success}</p>}
                                {errors.response && <p className='erro'>{errors.response}</p>}
                                <button type='submit' className='botaoCadastrar'>Cadastrar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </NavbarWrapper>
    );
};

export default RegisterProduct;
