import React, { useEffect, useState } from "react";
import axios from "axios";
import { Empty, Table, Button, Modal, Form, Input, message } from "antd";
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import Navbargest from "components/AdminNavbar/AdminNavbar";
import './index.css'

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
          <Button className="button-delete" onClick={() => handleDelete(record)} style={{ marginLeft: '8px' }}>Excluir</Button>
        </div>
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
      
      const updatedClient = { ...currentClient, ...values };
      const response = await axios.put(`http://localhost:8000/api/v1/clients/update/${currentClient.id}`, updatedClient);
      
      if (response.status === 200) {
        setOpen(false); 
        message.success('Cliente atualizado com sucesso!');
        getClients();
      } else {
        message.error('Falha ao atualizar o cliente. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao validar campos do formulário ou ao enviar a requisição:', error);
      message.error('Ocorreu um erro ao atualizar o cliente. Por favor, tente novamente.');
    }
  };

  const handleCancel = () => {
    setOpen(false); 
  };

 const handleDelete = async (record: Client) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/v1/clients/delete/${record.id}`);
      if(response.status === 204) message.success('Cliente excluído com sucesso!');
      
      getClients()

    } catch (error: any) {
      let status = error.response.status
      if(status === 403) message.error('Este cliente possui vendas vinculadas e não pode ser excluído.');
      else if(status === 404) message.error('Não foi possível encontrar o cliente especificado')
      else{
        message.error('Ocorreu um erro ao excluir o cliente. Por favor, tente novamente.');
        console.error('Erro ao excluir cliente:', error);
      }
    }
  };

  const isValidCPF = (cpf: string) => {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(.)\1+$/.test(cpf)) return false;

    let sum = 0;
    let remainder: number;

    for (let i = 1; i <= 9; i++)
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);

    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11)
    {
      remainder = 0;
  }
  
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++)
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);

  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) {
      remainder = 0;
  }

  if (remainder !== parseInt(cpf.substring(10, 11))) return false;

  return true;
};

const isValidCNPJ = (cnpj: string) => {
  cnpj = cnpj.replace(/\D/g, '');
  if (cnpj.length !== 14 || /^(.)\1+$/.test(cnpj)) return false;

  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  const digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;
  for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2)
          pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  size += 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;
  for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2)
          pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
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
      <Navbargest />
      <div className="containerCl">
          <h2>Lista de Clientes</h2>
          <Button className="button-refresh" onClick={getClients}>Recarregar clientes</Button>
          {clients.length > 0 ? (
              <Table columns={columns} dataSource={clients} rowKey={'id'} pagination={{defaultPageSize: 10, pageSizeOptions: [10,20,30]}}/>
          ) : (
              <Empty description={"Nenhum cliente encontrado"} />
          )}
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
