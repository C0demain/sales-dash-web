import React, { useEffect, useState } from "react";
import { Empty, Table, Button, Modal, Form, Input, message, Spin } from "antd";
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import Navbar from "components/Navbar/Navbar";
import './index.css'
import { isValidCNPJ, isValidCPF } from "util/validation";
import { customLocale } from "util/formatters";
import { apiInstance } from "services/api";

interface Client {
  id: string;
  name: string;
  segment: string;
  cpf: string;
}

function ShowClient() {
  const [clients, setClients] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  const columns = [
    {
      title: 'Cliente',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: any, b: any) => a.name.localeCompare(b.name)
    },
    {
      title: 'Segmento',
      dataIndex: 'segment',
      key: 'segment',
      sorter: (a: any, b: any) => a.segment.localeCompare(b.segment)
    },
    {
      title: 'CPF / CNPJ',
      dataIndex: 'cpf',
      key: 'cpf',
      sorter: (a: any, b: any) => a.cpf - b.cpf
    },
    {
      title: 'Ações',
      render: (text: any, record: Client) => (
        <div>
          <Button className="button-edit" onClick={() => handleEdit(record)}>Editar</Button>
        </div>
      )
    }
  ];

  const getClients = async () => {
    try {
      const response = await apiInstance.get<{ client: Client[] }>('http://localhost:8000/api/v1/clients/getclients');
      if (response.data && response.data.client) {
        setClients(response.data.client);
      } else {
        setClients([]);
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      setClients([]);
    } finally {
      setLoading(false);
      setDataLoaded(true);
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  const handleEdit = (record: Client) => {
    setCurrentClient(record);
    setOpen(true);
    form.setFieldsValue({
      name: record.name,
      segment: record.segment,
      cpf: record.cpf
    });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (!currentClient) {
        throw new Error('Nenhum cliente selecionado para atualização.');
      }

      const { cpf } = values;

      if (cpf.length > 11) {
        if (!isValidCNPJ(cpf)) {
          message.error('CNPJ inválido. Por favor, insira um CNPJ válido.');
          return;
        }
      } else {
        if (!isValidCPF(cpf)) {
          message.error('CPF inválido. Por favor, insira um CPF válido.');
          return;
        }
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
      if (error.response && error.response.status === 400) {
        message.error('CPF já está vinculado a outro usuário ou cliente.');
      } else {
        message.error('Ocorreu um erro ao registrar o usuário. Tente novamente.');
      }
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setFieldsValue({ cpf: value });
    if (value.length > 11) {
      if (!isValidCNPJ(value)) {
        // CNPJ inválido
      }
    } else {
      if (!isValidCPF(value)) {
        // CPF inválido
      }
    }
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
            <Form.Item
              name="cpf"
              label="CPF / CNPJ"
              rules={[{ required: true, message: 'Por favor, insira o CPF / CNPJ do cliente!' }]}
            >
              <Input onChange={handleCpfCnpjChange} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </NavbarWrapper>
  );
}

export default ShowClient;
