import React, { useEffect, useState } from "react";
import axios from "axios";
import { Empty, Table, Button, Modal, Form, Input, message } from "antd";
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import Navbar from "components/Navbar/Navbar";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  cpf: string;
}

const customLocale = {
  filterTitle: 'Filtrar',
  filterConfirm: 'OK',
  filterReset: 'Resetar',
  filterEmptyText: 'Sem filtros',
  emptyText: 'Nenhum usuário encontrado',
  selectAll: 'Selecionar página atual',
  selectInvert: 'Inverter seleção na página atual',
  sortTitle: 'Ordenar',
  triggerDesc: 'Clique para ordenar descendentemente',
  triggerAsc: 'Clique para ordenar ascendentemente',
  cancelSort: 'Clique para cancelar ordenação',
};

const ShowUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get<{ users: User[] }>("http://localhost:8000/api/v1/auth/users");
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setUsers([]);
      message.error('Erro ao buscar usuários. Por favor, tente novamente.');
    }
  };

  const handleEdit = (record: User) => {
    setCurrentUser(record);
    setVisible(true);
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      role: record.role,
      cpf: record.cpf,
    });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (!currentUser) {
        throw new Error('Nenhum usuário selecionado para atualização.');
      }

      const updatedUser = { ...currentUser, ...values };
      const response = await axios.put(`http://localhost:8000/api/v1/auth/user/${currentUser.id}`, updatedUser);

      if (response.status === 200) {
        message.success('Usuário atualizado com sucesso!');
        setVisible(false);
        getUsers();
      } else {
        message.error('Falha ao atualizar o usuário. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao validar campos do formulário ou ao enviar a requisição:', error);
      message.error('Ocorreu um erro ao atualizar o usuário. Por favor, tente novamente.');
    }
  };

  const handleRemove = async () => {
    try {
      if (!currentUser) {
        throw new Error('Nenhum usuário selecionado para remoção.');
      }

      const response = await axios.delete(`http://localhost:8000/api/v1/auth/user/${currentUser.id}`);

      if (response.status === 200) {
        message.success('Usuário removido com sucesso!');
        setVisible(false);
        getUsers();
      } else {
        message.error('Falha ao remover o usuário. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao enviar a requisição:', error);
      message.error('Ocorreu um erro ao remover o usuário. Por favor, tente novamente.');
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: User, b: User) => a.name.localeCompare(b.name),
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: User, b: User) => a.email.localeCompare(b.email),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      sorter: (a: User, b: User) => a.role.localeCompare(b.role),
    },
    {
      title: 'CPF',
      dataIndex: 'cpf',
      key: 'cpf',
      sorter: (a: User, b: User) => a.cpf.localeCompare(b.cpf),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: User) => (
        <>
          <Button className="button-edit" onClick={() => handleEdit(record)}>Editar</Button>
        </>
      ),
    },
  ];

  return (
    <NavbarWrapper>
      <Navbar />
      <div className="containerCl">
        <h2>Lista de Usuários</h2>
        <Button className="button-refresh" onClick={getUsers}>Recarregar usuários</Button>
        {users.length > 0 ? (
          <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            pagination={{ defaultPageSize: 10, pageSizeOptions: [10, 20, 30] }}
            locale={customLocale}
          />
        ) : (
          <Empty description="Nenhum usuário encontrado" />
        )}
        <Modal
          title="Editar Usuário"
          open={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Nome"
              rules={[{ required: true, message: 'Por favor, insira o nome do usuário!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="E-mail"
              rules={[{ required: true, message: 'Por favor, insira um e-mail válido!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: 'Por favor, insira a role do usuário!' }]}
            >
              <Input disabled/>
            </Form.Item>
            <Form.Item
              name="cpf"
              label="CPF"
              rules={[{ required: true, message: 'Por favor, insira o CPF do usuário!' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </NavbarWrapper>
  );
};

export default ShowUsers;
