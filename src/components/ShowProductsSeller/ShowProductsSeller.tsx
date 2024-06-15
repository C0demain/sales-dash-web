import React, { useEffect, useState } from "react";
import { Empty, Table, Button, message, Spin } from "antd";
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

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Product, b: Product) => a.name.localeCompare(b.name),
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
                  <p>Exibição de produtos com vendas vinculadas ao vendedor</p>
                  <Button type="primary" className="custom-button-refresh" onClick={getProducts}>Recarregar produtos</Button>
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
      </div>
    </NavbarWrapper>
  );
};

export default ShowProductsSeller;
