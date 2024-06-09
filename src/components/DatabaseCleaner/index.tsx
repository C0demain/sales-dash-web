import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import './index.css';
import { apiInstance } from 'services/api';
import NavbarWrapper from 'components/NavbarWrapper/NavbarWrapper';
import Navbar from 'components/Navbar/Navbar';

const DatabaseCleaner = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleCleanDatabase = async (e: any) => {
    e.preventDefault();

    setLoading(true);
    setVisible(false);

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
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <NavbarWrapper>
      <Navbar />
      <div className="containerGlobal">
        <div className="containerDatabaseCleaner">
          <h1 className="titulo">Apagar Arquivos Carregados</h1>
          <p>Clique no botão abaixo para apagar os dados do banco de dados.</p>
          <form className="formulario">
            <div className="insertText">
              <Button type='primary' className='custom-button' loading={loading} onClick={showModal}>
                Apagar Dados
              </Button>
              <Modal
                title="Confirmação"
                open={visible}
                onOk={handleCleanDatabase}
                onCancel={handleCancel}
                confirmLoading={loading}
                okText="Sim"
                cancelText="Cancelar"
              >
                <p>Deseja realmente apagar os dados do banco de dados?</p>
              </Modal>
            </div>
          </form>
        </div>
      </div>
    </NavbarWrapper>
  );
};

export default DatabaseCleaner;
