import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import './index.css';
import { apiInstance } from 'services/api';
import { useAuth } from 'context/AuthProvider/useAuth';

interface DatabaseCleanerProps {
  adminOnly?: boolean; 
}

const DatabaseCleaner: React.FC<DatabaseCleanerProps> = ({ adminOnly }) => {
  const { isAdmin } = useAuth(); // Usar o hook useAuth para verificar se o usuário é admin
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); 

  const handleCleanDatabase = async (e: any) => {
    e.preventDefault();

    setLoading(true);
    setOpen(false); 

    try {
      const response = await apiInstance.post('http://localhost:8000/api/v1/dashboard/clean-database');
      message.success(response.data.message);
    } catch (error) {
      message.error('Falha ao limpar o banco de dados.');
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  // Verificar se o usuário é admin antes de renderizar o componente
  if (adminOnly && !isAdmin()) {
    return null;
  }

  return (
    <div className="containerDatabaseCleaner">
      <h1 className="titulo">Apagar Arquivos Carregados</h1>
      <p>Clique no botão abaixo para apagar os dados do banco de dados.</p>

      <Button type='primary' className='custom-button' loading={loading} onClick={showModal}>
        Apagar Dados
      </Button>
      <Modal
        title="Confirmação"
        open={open} 
        onOk={handleCleanDatabase}
        onCancel={handleCancel}
        confirmLoading={loading}
        okText="Sim"
        cancelText="Cancelar"
      >
        <p>Deseja realmente apagar os dados do banco de dados?</p>
      </Modal>
    </div>
  );
};

export default DatabaseCleaner;
