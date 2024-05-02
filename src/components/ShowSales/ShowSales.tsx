import React, { useEffect, useState } from "react";
import axios from "axios";
import { Empty, Table, Button, Modal, Form, Input, message } from "antd";
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import Navbargest from "components/AdminNavbar/AdminNavbar"; 
import './ShowSales.css'
import { getUserLocalStorage } from "context/util";
import SelectSeller from "components/SelectSeller/SelectSeller";
import SelectClient from "components/SelectClient/SelectClient";
import SelectProduct from "components/SelectProduct/SelectProduct";

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
  const [client, setClient] = useState<any>()
  const [product, setProduct] = useState<any>()

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
      dataIndex: 'clientName',
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
      key: 'value'
    },
    {
      title: 'Ações',
      render: (text: any, record: Sale) => (
        <Button onClick={() => handleEdit(record)}>Editar</Button>
      )
    }
  ];

  const getSells = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/sells/getall');
      if (response.data && response.data.sells) {
        setSells(response.data.sells);
        let sells = response.data.sells
        for(let s of sells){
          s.clientName=s.client.name
          s.productName=s.product.name
          s.seller=s.user.name
        }
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
    setSeller(record.user.cpf[0]);
    setProduct(record.product.id)
    setClient(record.client.cpf[0])
    console.log(client)
    setCurrentSale(record);
    form.setFieldsValue({
      id: record.id,
      date: record.date,
      seller: seller,
      client: client,
      product: product,
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
      
      const updatedSale = {date:null, seller_cpf:null, product_id:null, cpf_client:null, value:null};
      updatedSale.date = values.date
      updatedSale.seller_cpf = seller
      updatedSale.product_id = product
      updatedSale.cpf_client = client
      updatedSale.value = values.value
      console.log(updatedSale)
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
        <Button onClick={getSells}>Recarregar vendas</Button>
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
              <SelectClient
              controlState={[client, setClient]}
              dataKey="cpf"
              />
            </Form.Item>
            <Form.Item
              name="product"
              label="Produto"
              rules={[{ required: true, message: 'Por favor, insira o produto!' }]}
            >
              <SelectProduct
              controlState={[product, setProduct]}
              dataKey="cpf"
              />
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
