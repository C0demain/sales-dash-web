import React, { useEffect, useState, useCallback } from "react";
import { Empty, Table, Button, message, TableColumnsType, Select, DatePicker, Row, Col, Spin } from "antd";
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import Navbar from "components/Navbar/Navbar";
import { customLocale, formatCurrency } from "util/formatters";
import SelectProduct from "components/SelectProduct/SelectProduct";
import SelectClient from "components/SelectClient/SelectClient";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { apiInstance } from "services/api";
import './index.css';

dayjs.extend(customParseFormat);

interface Sale {
  id: string;
  date: Date;
  seller: string;
  clientName: string;
  productName: string;
  value: number;
}

function ShowSalesSeller() {
  const [sales, setSells] = useState<Sale[]>([]);
  const [userSelect, setUserSelect] = useState<any>(null);
  const [productSelect, setProductSelect] = useState<any>(null);
  const [clientSelect, setClientSelect] = useState<any>(null);
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>('30/05/3000');
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  const columns: TableColumnsType = [
    {
      title: 'Data',
      dataIndex: 'date',
      key: 'date',
      render: (value: string | number | dayjs.Dayjs | Date) => dayjs(value).format('DD/MM/YYYY'), // Formata a data
      sorter: (a: { date: string | number | Date; }, b: { date: string | number | Date; }) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      defaultSortOrder: "descend"
    },
    {
      title: 'Cliente',
      dataIndex: 'clientname',
      key: 'client',
      sorter: (a: any, b: any) => a.clientname.localeCompare(b.clientname)
    },
    {
      title: 'Produto',
      dataIndex: 'productName',
      key: 'product',
      sorter: (a: any, b: any) => a.productName.localeCompare(b.productName)
    },
    {
      title: 'Valor',
      dataIndex: 'value',
      key: 'value',
      render: value => formatCurrency(value),
      align: "end"
    }
  ];

  const getSells = useCallback(async () => {
    if (!userSelect) {
      return; 
    }

    setLoading(true);
    let url = "http://localhost:8000/api/v1/sells/getfilter/";
    const userFilter = userSelect ? `userId=${userSelect}` : "";
    const productFilter = productSelect ? `productId=${productSelect}` : "";
    const clientFilter = clientSelect ? `clientId=${clientSelect}` : "";
    const startDateFilter = startDate ? `startDate=${dayjs(startDate, 'DD/MM/YYYY').format('YYYY-MM-DD')}` : "";
    const endDateFilter = endDate ? `endDate=${dayjs(endDate, 'DD/MM/YYYY').format('YYYY-MM-DD')}` : "";

    let queryParams = [userFilter, productFilter, clientFilter, startDateFilter, endDateFilter];
    const query = queryParams.filter(e => e !== '').join('&');
    url += query ? `?${query}` : "";

    const response = await apiInstance.get(url, {
      withCredentials: false,
    });
    setSells(response.data.sells);
    setLoading(false);
    setDataLoaded(true);
  }, [userSelect, productSelect, clientSelect, startDate, endDate]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.id) {
      setUserSelect(user.id);
    }
  }, []);

  useEffect(() => {
    getSells();
  }, [getSells]);

  const handleDatePicker = (date: any) => {
    return date ? dayjs(date).format('DD/MM/YYYY') : "";
  };

  return (
    <NavbarWrapper>
      <Navbar />
      <div className="containerSl">
        
        <h2>Lista de Vendas</h2>
          <Row gutter={16}>
          <Col className="filter-col">
            <SelectProduct
              controlState={[productSelect, setProductSelect]}
              dataKey="id"
              className="fixed-height-select"
            />
          </Col>
          <Col className="filter-col">
            <SelectClient
              controlState={[clientSelect, setClientSelect]}
              dataKey="id"
              className="fixed-height-select"
            />
          </Col>
          <Col className="filter-col">
            <DatePicker
              onChange={e => { setStartDate(handleDatePicker(e)) }}
              format="DD/MM/YYYY"
              placeholder="Data de início"
              className="fixed-height-select"
            />
          </Col>
          <Col className="filter-col">
            <DatePicker
              onChange={e => { setEndDate(handleDatePicker(e)) }}
              format="DD/MM/YYYY"
              placeholder="Data final"
              className="fixed-height-select"
            />
          </Col>
          <Col style={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
            <Button className='button-filter' onClick={getSells}>Filtrar vendas</Button>
          </Col>
        </Row>
        <Spin spinning={loading}>
        {sales.length === 0 && !loading && dataLoaded ? (
              <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                <Empty description="Nenhuma venda cadastrada" />
              </div>
            ) : (
            <>
              {sales.length > 0 && (
                <>
                  <Table
                    columns={columns}
                    dataSource={sales}
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

export default ShowSalesSeller;
