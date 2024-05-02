import React, { useEffect, useState } from "react";
import axios from "axios";
import { Empty, Table, Button, Modal, Form, Input, message } from "antd";
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import Navbargest from "components/AdminNavbar/AdminNavbar"; 
import './ShowSales.css'

interface Sale {
  id: string;
  date: string;
  seller: string;
  client: string;
  product: string;
  value: number;
}

function ShowSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentSale, setCurrentSale] = useState<Sale | null>(null);

  const columns = [
    {
      title: 'Data',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'Vendedor',
      dataIndex: 'seller',
      key: 'seller'
    },
    {
      title: 'Cliente',
      dataIndex: 'client',
      key: 'client'
    },
    {
      title: 'Produto',
      dataIndex: 'product',
      key: 'product'
    },
    {
      title: 'Valor',
      dataIndex: 'value',
      key: 'value'
    },
    {
      title: 'Ações',
      render: (text: any, record: Sale) => (
        <Button onClick={() => handleEdit(record)}>Editar</Button>
      )
    }
  ];

  const getSales = async () => {
    try {
      const response = await axios.get<{ sales: Sale[] }>('http://localhost:8000/api/v1/sells/getall');
      if (response.data && response.data.sales) {
        setSales(response.data.sales);
      } else {
        setSales([]);
      }
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
      setSales([]);
    }
  };

  useEffect(() => {
    getSales();
  }, []);

  const handleEdit = (record: Sale) => {
    setCurrentSale(record);
    form.setFieldsValue({
      date: record.date,
      seller: record.seller,
      client: record.client,
      product: record.product,
      value: record.value,
    });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (!currentSale) {
        throw new Error('Nenhuma venda selecionada para atualização.');
      }
      
      const updatedSale = { ...currentSale, ...values };
      const response = await axios.put(`http://localhost:8000/api/v1/sells/update/${currentSale.id}`, updatedSale);
      
      if (response.status === 200) {
        setVisible(false);
        message.success('Venda atualizada com sucesso!');
        getSales(); // Atualiza a tabela após a atualização da venda
      } else {
        message.error('Falha ao atualizar a venda. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao validar campos do formulário ou ao enviar a requisição:', error);
      message.error('Ocorreu um erro ao atualizar a venda. Por favor, tente novamente.');
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <NavbarWrapper>
      <Navbargest/>
      <div className="containerS1">
        <h2>Lista de Vendas</h2>
        <Button onClick={getSales}>Recarregar vendas</Button>
        {sales.length > 0 ? (
          <Table columns={columns} dataSource={sales} />
        ) : (
          <Empty description={"Nenhuma venda encontrada"} />
        )}
        <Modal
          title="Editar Venda"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="date"
              label="Data"
              rules={[{ required: true, message: 'Por favor, insira a data da venda!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="seller"
              label="Vendedor"
              rules={[{ required: true, message: 'Por favor, insira o vendedor!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="client"
              label="Cliente"
              rules={[{ required: true, message: 'Por favor, insira o cliente!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="product"
              label="Produto"
              rules={[{ required: true, message: 'Por favor, insira o produto!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="value"
              label="Valor"
              rules={[{ required: true, message: 'Por favor, insira o valor!' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </NavbarWrapper>
  );
}

export default ShowSales;
