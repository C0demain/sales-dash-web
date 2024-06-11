import React, { useEffect, useState } from "react";
import { Empty, Table, Button, Modal, Form, Input, message, Spin } from "antd";
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import Navbar from "components/Navbar/Navbar";
import { customLocale } from "util/formatters";
import { apiInstance } from "services/api";
import { useAuth } from "context/AuthProvider/useAuth";

interface Client {
  id: string;
  name: string;
  segment: string;
  cpf_cnpj: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  role: string;
  sells: {
    client: Client;
  }[];
}

function ShowClientsSeller() {
  const [clients, setClients] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const userId = useAuth().id;

  useEffect(() => {
    getClients();
  }, []);

  const getClients = async () => {
    setLoading(true);
    try {
      const response = await apiInstance.get<{ user: User }>(`http://localhost:8000/api/v1/auth/user/clients/${userId}`);
      const clients = response.data.user.sells.map(sell => sell.client);
      setClients(clients || []);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      setClients([]);
      message.error('Erro ao buscar clientes. Por favor, tente novamente.');
    } finally {
      setLoading(false);
      setDataLoaded(true);
    }
  };

  const columns = [
    {
      title: 'Cliente',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Client, b: Client) => a.name.localeCompare(b.name)
    },
    {
      title: 'Segmento',
      dataIndex: 'segment',
      key: 'segment',
      sorter: (a: Client, b: Client) => a.segment.localeCompare(b.segment)
    },
    {
      title: 'CPF / CNPJ',
      dataIndex: 'cpf_cnpj',
      key: 'cpf_cnpj',
      sorter: (a: Client, b: Client) => a.cpf_cnpj.localeCompare(b.cpf_cnpj)
    },
    {
      title: 'Ações',
      render: (_: any, record: Client) => (
        <Button className="button-edit" onClick={() => handleEdit(record)}>Editar</Button>
      )
    }
  ];

  const handleEdit = (record: Client) => {
    setCurrentClient(record);
    setOpen(true);
    form.setFieldsValue({
      name: record.name,
      segment: record.segment,
    });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (!currentClient) {
        throw new Error('Nenhum cliente selecionado para atualização.');
      }

      const updatedClient = { ...currentClient, ...values };
      const response = await apiInstance.put(`http://localhost:8000/api/v1/clients/update/${currentClient.id}`, updatedClient);

      if (response.status === 200) {
        setOpen(false);
        message.success('Cliente atualizado com sucesso!');
        getClients();
      } else {
        message.error('Falha ao atualizar o cliente. Por favor, tente novamente.');
      }
    } catch (error: any) {
      message.error('Ocorreu um erro ao atualizar o cliente. Tente novamente.');
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <NavbarWrapper>
      <Navbar />
      <div className="containerCl">
        <Spin spinning={loading}>
          {dataLoaded && clients.length === 0 ? (
            <Empty description="Nenhum cliente encontrado" />
          ) : (
            <>
              {clients.length > 0 && (
                <>
                  <h2>Lista de Clientes</h2>
                  <p>Exibição de clientes com vendas vinculadas ao vendedor</p>
                  <Button type="primary" className="custom-button-refresh" onClick={getClients}>Recarregar clientes</Button>
                  <Table
                    columns={columns}
                    dataSource={clients}
                    rowKey={'id'}
                    pagination={{ defaultPageSize: 10, pageSizeOptions: [10, 20, 30] }}
                    locale={customLocale}
                  />
                </>
              )}
            </>
          )}
        </Spin>
        <Modal
          title="Editar Cliente"
          open={open}
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
          </Form>
        </Modal>
      </div>
    </NavbarWrapper>
  );
}

export default ShowClientsSeller;
