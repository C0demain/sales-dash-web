import React, { useEffect, useState } from "react";
import axios from "axios";
import { Empty, Table, Button, Modal, Form, Input, message } from "antd";
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import Navbargest from "components/AdminNavbar/AdminNavbar";


interface Product {
  id: number;
  name: string;
  description: string;
  value: number;
}

function ShowProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Descrição',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Valor',
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`
    },
    {
      title: 'Ações',
      render: (text: any, record: Product) => (
        <Button className="button-edit" onClick={() => handleEdit(record)}>Editar</Button>
      )
    }
  ];

  const getProducts = async () => {
    try {
      const response = await axios.get<{ products: Product[] }>("http://localhost:8000/api/v1/products/getAll");
      if (response.data && response.data.products) {
        setProducts(response.data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleEdit = (record: Product) => {
    setCurrentProduct(record);
    setOpen(true);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      value: record.value 
    });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (!currentProduct) {
        throw new Error('Nenhum produto selecionado para atualização.');
      }
      
      const updatedProduct = { ...currentProduct, ...values };
      const response = await axios.put(`http://localhost:8000/api/v1/products/${currentProduct.id}`, updatedProduct);
      
      if (response.status === 200) {
        setOpen(false);
        message.success('Produto atualizado com sucesso!');
        getProducts(); 
      } else {
        message.error('Falha ao atualizar o produto. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao validar campos do formulário ou ao enviar a requisição:', error);
      message.error('Ocorreu um erro ao atualizar o produto. Por favor, tente novamente.');
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <NavbarWrapper>
      <Navbargest/>
      <div className="containerCl">
        <h2>Lista de Produtos</h2>
        <Button className="button-refresh" onClick={getProducts}>Recarregar produtos</Button>
        {products.length > 0 ? (
          <Table columns={columns} dataSource={products} rowKey={'id'}/>
        ) : (
          <Empty description={"Nenhum produto encontrado"} />
        )}
        <Modal
          title="Editar Produto"
          open={open}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Nome"
              rules={[{ required: true, message: 'Por favor, insira o nome do produto!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Descrição"
              rules={[{ required: true, message: 'Por favor, insira a descrição do produto!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
                name="value"
                label="Valor"
                rules={[{ required: true, message: 'Por favor, insira o valor do produto!' }]}
              >
              <Input type="number" step="0.01" min="0" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </NavbarWrapper>
  );
}

export default ShowProduct;
