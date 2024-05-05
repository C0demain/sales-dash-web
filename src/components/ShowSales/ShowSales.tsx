import React, { useEffect, useState } from "react";
import axios from "axios";
import { Empty, Table, Button, Modal, Form, Input, message, TableColumnsType } from "antd";
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import Navbargest from "components/AdminNavbar/AdminNavbar"; 
import './ShowSales.css'
import SelectSeller from "components/SelectSeller/SelectSeller";
import { formatCurrency, formatDate } from "util/formatters";

interface Sale {
  id: string;
  date: string;
  seller: string;
  clientName: string;
  productName: string;
  value: number;
}

function ShowSales() {
  const [sales, setSells] = useState<Sale[]>([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentSale, setCurrentSale] = useState<Sale | null>(null);
  const [seller, setSeller] = useState<any> ()

  const columns:TableColumnsType = [
    {
      title: 'Data',
      dataIndex: 'date',
      key: 'date',
      render: value => formatDate(value)
    },
    {
      title: 'Vendedor',
      dataIndex: 'seller',
      key: 'seller'
    },
    {
      title: 'Cliente',
      dataIndex: 'clientname',
      key: 'client'
    },
    {
      title: 'Produto',
      dataIndex: 'productName',
      key: 'product'
    },
    {
      title: 'Valor',
      dataIndex: 'value',
      key: 'value',
      render: value => formatCurrency(value),
      align: "end"
    },
    {
      title: 'Ações',
      render: (text: any, record: Sale) => (
        <Button className='button-edit' onClick={() => handleEdit(record)}>Editar</Button>
      )
    }
  ];

  const getSells = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/sells/getall');
      if (response.data && response.data.sell) {
        setSells(response.data.sell);
        let sells = response.data.sell
      } else {
        setSells([]);
      }
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
      setSells([]);
    }
  };

  useEffect(() => {
    getSells();
  }, []);

  const handleEdit = (record: any) => {
    setSeller(record.user.cpf);
    setCurrentSale(record);
    form.setFieldsValue({
      id: record.id,
      date: record.date,
      seller: record.user.cpf,
      client: record.clientname,
      product: record.productName,
      value: record.value,
    });
    setVisible(true); 
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (!currentSale) {
        throw new Error('Nenhuma venda selecionada para atualização.');
      }
      
      const updatedSale = {
        date: values.date,
        seller_cpf: seller,
        value: values.value
      }

      const response = await axios.put(`http://localhost:8000/api/v1/sells/update/${currentSale.id}`, updatedSale);
      if (response.status === 200) {
        setVisible(false);
        message.success('Venda atualizada com sucesso!');
        getSells(); // Atualiza a tabela após a atualização da venda
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
      <div className="containerSl">
        <h2>Lista de Vendas</h2>
        <Button className= 'button-refresh' onClick={getSells}>Recarregar vendas</Button>
        {sales.length > 0 ? (
          <Table columns={columns} dataSource={sales} rowKey={'id'}/>
        ) : (
          <Empty description={"Nenhuma venda encontrada"} />
        )}
        <Modal
          title="Editar Venda"
          open={visible}
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
              <SelectSeller
              controlState={[seller, setSeller]}
              dataKey="cpf"
              />
            </Form.Item>
            <Form.Item
              name="client"
              label="Cliente"
              rules={[{ required: true, message: 'Por favor, insira o cliente!' }]}
            >
              <Input disabled/>
            </Form.Item>
            <Form.Item
              name="product"
              label="Produto"
              rules={[{ required: true, message: 'Por favor, insira o produto!' }]}
            >
              <Input disabled/>
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
