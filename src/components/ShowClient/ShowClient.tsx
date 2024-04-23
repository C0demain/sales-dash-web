import React, { useEffect, useState } from "react";
import axios from "axios";
import { Empty, Table, Button, Modal, Form, Input, message } from "antd";
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import Navbargest from "components/AdminNavbar/AdminNavbar";

interface Client {
  id: string;
  name: string;
  segment: string;
  cpf: string;
}

function ShowClient() {
  const [clients, setClients] = useState<Client[]>([]);
  const [visible, setVisible] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Cliente',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Segmento',
      dataIndex: 'segment',
      key: 'segment'
    },
    {
      title: 'CPF / CNPJ',
      dataIndex: 'cpf',
      key: 'cpf'
    },
    {
      title: 'Ações',
      render: (text: any, record: Client) => (
        <Button onClick={() => handleEdit(record)}>Editar</Button>
      )
    }
  ];

  const getClients = async () => {
    try {
      const response = await axios.get<{ client: Client[] }>('http://localhost:8000/api/v1/clients/getclients');
      if (response.data && response.data.client) {
        setClients(response.data.client);
      } else {
        setClients([]);
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      setClients([]);
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  const handleEdit = (record: Client) => {
    setCurrentClient(record);
    setVisible(true);
    form.setFieldsValue({
      name: record.name,
      segment: record.segment,
      cpf: record.cpf
    });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const updatedClient = { ...currentClient, ...values };
      const response = await axios.put(`http://localhost:8000/api/v1/clients/register`, updatedClient);
      
      if (response.status === 200) {
        setVisible(false);
        message.success('Cliente atualizado com sucesso!');
      } else {
        message.error('Falha ao atualizar o cliente. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao validar campos do formulário ou ao enviar a requisição:', error);
      message.error('Ocorreu um erro ao atualizar o cliente. Por favor, tente novamente.');
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <NavbarWrapper>
      <Navbargest/>
      <div className="ranking">
        <h2>Lista de Clientes</h2>
        <Button onClick={getClients}>Recarregar clientes</Button>
        {clients.length > 0 ? (
          <Table columns={columns} dataSource={clients} />
        ) : (
          <Empty description={"Nenhum cliente encontrado"} />
        )}
        <Modal
          title="Editar Cliente"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Nome"
              rules={[{ required: true, message: 'Por favor, insira o nome do cliente!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="segment"
              label="Segmento"
              rules={[{ required: true, message: 'Por favor, insira o segmento do cliente!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="cpf"
              label="CPF / CNPJ"
              rules={[{ required: true, message: 'Por favor, insira o CPF / CNPJ do cliente!' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </NavbarWrapper>
  );
}

export default ShowClient;
