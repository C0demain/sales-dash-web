import React, { useEffect, useState } from "react";
import { Empty, Table, Button, message, Spin } from "antd";
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import Navbar from "components/Navbar/Navbar";
import { customLocale } from "util/formatters";
import { apiInstance } from "services/api";
import { useAuth } from "context/AuthProvider/useAuth";
import './index.css';

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
    }
  ];

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
      </div>
    </NavbarWrapper>
  );
}

export default ShowClientsSeller;
