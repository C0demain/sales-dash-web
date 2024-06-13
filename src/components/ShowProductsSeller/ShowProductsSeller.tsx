import React, { useEffect, useState } from "react";
import { Empty, Table, Button, Modal, Form, Input, message, Spin } from "antd";
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import Navbar from "components/Navbar/Navbar";
import { customLocale } from "util/formatters";
import { apiInstance } from "services/api";
import { useAuth } from "context/AuthProvider/useAuth";

interface Product {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  role: string;
  sells: {
    product: Product;
  }[];
}

const ShowProductsSeller: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const userId = useAuth().id;

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await apiInstance.get<{ user: User }>(`http://localhost:8000/api/v1/auth/user/products/${userId}`);
      const products = response.data.user.sells.map(sell => sell.product);
      setProducts(products || []);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setProducts([]);
      message.error('Erro ao buscar produtos. Por favor, tente novamente.');
    } finally {
      setLoading(false);
      setDataLoaded(true);
    }
  };

  const handleEdit = (record: Product) => {
    setCurrentProduct(record);
    setOpen(true);
    form.setFieldsValue({
      name: record.name,
    });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (!currentProduct) {
        throw new Error('Nenhum produto selecionado para atualização.');
      }

      const updatedProduct = { ...currentProduct, ...values };
      const response = await apiInstance.put(`http://localhost:8000/api/v1/products/${currentProduct.id}`, updatedProduct);

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
        <Spin spinning={loading}>
          {dataLoaded && products.length === 0 ? (
            <Empty description="Nenhum produto encontrado" />
          ) : (
            <>
              {products.length > 0 && (
                <>
                  <h2>Lista de Produtos</h2>
                  <p> Exibição de produtos com vendas vinculadas ao vendedor </p>
                  <Button type="primary" className="custom-button-refresh" onClick={getProducts}> Recarregar produtos </Button>
                  <Table
                    columns={columns}
                    dataSource={products}
                    rowKey="id"
                    pagination={{ defaultPageSize: 10, pageSizeOptions: [10, 20, 30] }}
                    locale={customLocale}
                  />
                </>
              )}
            </>
          )}
        </Spin>
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

export default ShowProductsSeller;