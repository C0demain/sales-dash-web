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

const customLocale = {
  filterTitle: 'Filtrar',
  filterConfirm: 'OK',
  filterReset: 'Resetar',
  filterEmptyText: 'Sem filtros',
  emptyText: 'Nenhuma venda encontrada',
  selectAll: 'Selecionar página atual',
  selectInvert: 'Inverter seleção na página atual',
  sortTitle: 'Ordenar',
  triggerDesc: 'Clique para ordenar descendentemente',
  triggerAsc: 'Clique para ordenar ascendentemente',
  cancelSort: 'Clique para cancelar ordenação'
};

function ShowProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: any, b: any) => a.name.localeCompare(b.name)
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
          <Table 
            columns={columns} 
            dataSource={products} 
            rowKey={'id'} 
            pagination={{defaultPageSize: 10, pageSizeOptions: [10,20,30]}}
            locale={customLocale}
            />
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
          </Form>
        </Modal>
      </div>
    </NavbarWrapper>
  );
}

export default ShowProduct;
