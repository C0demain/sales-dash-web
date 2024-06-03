import React, { useEffect, useState } from "react";
import { Empty, Table, Button, Modal, Form, Input, message, Spin } from "antd";
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import Navbar from "components/Navbar/Navbar";
import { customLocale } from "util/formatters";
import { apiInstance } from "services/api";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  cpf: string;
}

const ShowUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);


  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await apiInstance.get<{ users: User[] }>("http://localhost:8000/api/v1/auth/users");
      const transformedUsers = response.data.users.map(user => ({
        ...user,
        role: user.role === 'admin' ? 'Gestor' : user.role === 'user' ? 'Vendedor' : user.role,
      }));
      setUsers(transformedUsers || []);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setUsers([]);
      message.error('Erro ao buscar usuários. Por favor, tente novamente.');
    } finally {
      setLoading(false);
      setDataLoaded(true);
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

      // Remove senha se existir para garantir que não seja alterada
      delete updatedUser.password;

      const response = await apiInstance.put(`http://localhost:8000/api/v1/auth/user/${currentUser.id}`, updatedUser);

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

  const handleCancel = () => {
    setVisible(false);
  };

  const formatCPF = (cpf: string) => {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
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
      title: 'Função',
      dataIndex: 'role',
      key: 'role',
      sorter: (a: User, b: User) => a.role.localeCompare(b.role),
    },
    {
      title: 'CPF',
      dataIndex: 'cpf',
      key: 'cpf',
      sorter: (a: User, b: User) => a.cpf.localeCompare(b.cpf),
      render: (text: string) => (text ? formatCPF(text) : 'CPF não disponível'),
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
        <Spin spinning={loading}>
          {dataLoaded && users.length === 0 ? (
            <Empty description="Nenhum usuário encontrado" />
          ) : (
            <>
              {users.length > 0 && (
                <>
                  <h2>Lista de Usuários</h2>
                  <Button type="primary" className="custom-button-refresh" onClick={getUsers}>Recarregar usuários</Button>
                </>
              )}

              <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                pagination={{ defaultPageSize: 10, pageSizeOptions: [10, 20, 30] }}
                locale={customLocale}
              />

            </>
          )}
        </Spin>
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
              label="Função"
            >
              <Input disabled />
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
