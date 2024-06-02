import React, { useEffect, useState } from "react";
import axios from "axios";
import { Empty, Table, Button, Modal, Form, Input, message } from "antd";
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import Navbar from "components/Navbar/Navbar";
import { customLocale } from "util/formatters";

interface Product {
  id: number;
  name: string;
  description: string;
}

const ShowProduct: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await axios.get<{ products: Product[] }>("http://localhost:8000/api/v1/products/getAll");
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setProducts([]);
      message.error('Erro ao buscar produtos. Por favor, tente novamente.');
    }
  };

  const handleEdit = (record: Product) => {
    setCurrentProduct(record);
    setOpen(true);
    form.setFieldsValue({
      name: record.name
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
        message.success('Produto atualizado com sucesso!');
        setOpen(false);
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

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Product, b: Product) => a.name.localeCompare(b.name),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: Product) => (
        <Button className="button-edit" onClick={() => handleEdit(record)}>Editar</Button>
      ),
    },
  ];

  return (
    <NavbarWrapper>
      <Navbar />
      <div className="containerCl">
        <h2>Lista de Produtos</h2>
        <Button className="button-refresh" onClick={getProducts}>Recarregar produtos</Button>
        {products.length > 0 ? (
          <Table
            columns={columns}
            dataSource={products}
            rowKey="id"
            pagination={{ defaultPageSize: 10, pageSizeOptions: [10, 20, 30] }}
            locale={customLocale}
          />
        ) : (
          <Empty description="Nenhum produto encontrado" />
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
          </Form>
        </Modal>
      </div>
    </NavbarWrapper>
  );
};

export default ShowProduct;
