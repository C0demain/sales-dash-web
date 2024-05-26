import { useState } from 'react';
import { Input } from 'antd';
import { updatePassword } from '.';
import Navbar from 'components/Navbar/Navbar';
import NavbarWrapper from 'components/NavbarWrapper/NavbarWrapper';
import './index.css'

function UpdatePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('As novas senhas não coincidem');
      return;
    }
    try {
      await updatePassword(newPassword);
      setSuccess('Senha atualizada com sucesso');
      setError(''); // Clear error message if success
    } catch (error) {
      setError('Erro ao atualizar a senha');
      setSuccess(''); // Clear success message if error
    }
  };

  return (
    <NavbarWrapper>
      <Navbar />
      <div className='containerGlobal'>
        <div className='containerUpdatePassword'>
          <h2> Atualização de Senha</h2>
          <form onSubmit={handleSubmit}>

            <div className='insertText'>
              <label>Nova Senha:</label>
              <Input.Password
                className='inputField'
                placeholder='Nova Senha'
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className='insertText'>
              <label>Confirme a Nova Senha:</label>
              <Input.Password
                className='inputField'
                placeholder='Confirme a Nova Senha'
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className='erro'>{error}</p>}
            {success && <p className='funciona'>{success}</p>}
            <button type='submit' className='botaoCadastrar'>Atualizar Senha</button>
          </form>
        </div>
      </div>
    </NavbarWrapper>
  );
}

export default UpdatePassword;
