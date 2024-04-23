import React, { useEffect, useState } from "react";
import axios from "axios";
import { Empty, Table, Button, Modal, Form, Input, message } from "antd";
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import Navbargest from "components/AdminNavbar/AdminNavbar";
import './showclient.css'

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
      cpf: formatCPF(record.cpf) // Aplica a máscara no CPF ao editar
    });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (!currentClient) {
        throw new Error('Nenhum cliente selecionado para atualização.');
      }
      
      const updatedClient = { ...currentClient, ...values };
      const response = await axios.put(`http://localhost:8000/api/v1/clients/update/${currentClient.id}`, updatedClient);
      
      if (response.status === 200) {
        setVisible(false);
        message.success('Cliente atualizado com sucesso!');
        getClients(); // Atualiza a tabela após a atualização do cliente
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

  // Função para formatar o CPF com a máscara
  const formatCPF = (value: string) => {
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  return (
    <NavbarWrapper>
      <Navbargest/>
      <div className="containerCl">
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
              <Input onChange={(e) => form.setFieldsValue({ cpf: formatCPF(e.target.value) })} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </NavbarWrapper>
  );
}

export default ShowClient; 