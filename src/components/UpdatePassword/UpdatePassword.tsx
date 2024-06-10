import { useState } from 'react';
import { Button, Input, message } from 'antd';
import { updatePassword } from '.';
import Navbar from 'components/Navbar/Navbar';
import NavbarWrapper from 'components/NavbarWrapper/NavbarWrapper';
import './index.css';

function UpdatePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: any) => {
    setLoading(true);
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      message.error('As novas senhas não coincidem');
      return;
    }
    try {
      const response: any = await updatePassword(newPassword);
      if (response.success) {
        message.success('Senha Atualizada com Sucesso!');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('Erro ao Atualizar a Senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <NavbarWrapper>
      <Navbar />
      <div className='containerGlobal'>
        <div className='containerUpdatePassword'>
          <h2>Atualização de Senha</h2>
          <form onSubmit={handleSubmit}>
            <div className='passwordRules'>
              <p>A nova senha deve conter:</p>
              <ul>
                <li>Pelo menos 8 caracteres</li>
                <li>Pelo menos um número</li>
                <li>Pelo menos um caractere especial (!@#$%^&*)</li>
              </ul>
            </div>

            <div className='insertText'>
              <label>Nova Senha:</label>
              <Input.Password
                value={newPassword}
                className='inputField'
                placeholder='Nova Senha'
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className='insertText'>
              <label>Confirme a Nova Senha:</label>
              <Input.Password
                value={confirmPassword}
                className='inputField'
                placeholder='Confirme a Nova Senha'
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button type='primary' htmlType='submit' className='custom-button' loading={loading}>Atualizar Senha</Button>
          </form>
        </div>
      </div>
    </NavbarWrapper>
  );
}

export default UpdatePassword;
