import { useState } from 'react';
import NavbarWrapper from 'components/NavbarWrapper/NavbarWrapper';
import { sendData } from './index';
import './index.css';
import { Button, message } from 'antd';
import Navbar from 'components/Navbar/Navbar';

function RegisterProduct() {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const validate = (): boolean => {
        if (!name) {
            message.error('O nome é obrigatório.');
            return false;
        } else if (name.length < 3) {
            message.error('O nome deve ter mais de 3 caracteres.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        event.preventDefault();
        if (validate()) {
            try {
                await sendData(name);
                message.success('Produto Cadastrado com Sucesso!');
                setName(''); // Limpa o campo de nome após o sucesso
            } catch (error: any) {
                message.error('Ocorreu um erro ao registrar o produto. Tente novamente.');
                console.error('Erro ao registrar o produto:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <NavbarWrapper>
            <Navbar />
                <div className="containerGlobal">
                    <div className='containerRegisterProduct'>
                            <h1 className='titulo'>Cadastro de Produto</h1>
                            <form className="formulario" onSubmit={handleSubmit}>
                                <div className='insertText'>
                                    <label>Nome do produto:</label>
                                    <input
                                        placeholder="Nome"
                                        value={name}
                                        type="text"
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type='primary' htmlType='submit' className='custom-button' loading={loading}>Cadastrar</Button>
                            </form>
                        </div>
                    </div>
        </NavbarWrapper>
    );
}

export default RegisterProduct;
