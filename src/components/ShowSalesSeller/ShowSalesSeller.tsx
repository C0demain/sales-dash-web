import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Empty, Table, Button, Modal, Form, Input, message, TableColumnsType, Select, DatePicker, Row, Col } from "antd";
import NavbarWrapper from "components/NavbarWrapper/NavbarWrapper";
import Navbar from "components/Navbar/Navbar";
import { customLocale, formatCurrency } from "util/formatters";
import moment from 'moment';
import SelectProduct from "components/SelectProduct/SelectProduct";
import SelectClient from "components/SelectClient/SelectClient";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';

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
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentSale, setCurrentSale] = useState<Sale | null>(null);
  const [seller, setSeller] = useState<any>(null);
  const [userSelect, setUserSelect] = useState<any>(null);
  const [productSelect, setProductSelect] = useState<any>(null);
  const [clientSelect, setClientSelect] = useState<any>(null);
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>('30/05/3000');

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
    },
    {
      title: 'Ações',
      render: (text: any, record: Sale) => (
        <Button className='button-edit' onClick={() => handleEdit(record)}>Editar</Button>
      )
    }
  ];

  const getSells = useCallback(async () => {
    let url = "http://localhost:8000/api/v1/sells/getfilter/";
    const userFilter = userSelect ? `userId=${userSelect}` : "";
    const productFilter = productSelect ? `productId=${productSelect}` : "";
    const clientFilter = clientSelect ? `clientId=${clientSelect}` : "";
    const startDateFilter = startDate ? `startDate=${dayjs(startDate, 'DD/MM/YYYY').format('YYYY-MM-DD')}` : "";
    const endDateFilter = endDate ? `endDate=${dayjs(endDate, 'DD/MM/YYYY').format('YYYY-MM-DD')}` : "";

    let queryParams = [userFilter, productFilter, clientFilter, startDateFilter, endDateFilter];
    const query = queryParams.filter(e => e !== '').join('&');
    url += query ? `?${query}` : "";

    const response = await axios.get(url, {
      withCredentials: false,
    });
    setSells(response.data.sells);
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

  const handleEdit = (record: any) => {
    setSeller(record.user.cpf);
    setCurrentSale(record);
    form.setFieldsValue({
      id: record.id,
      date: dayjs(record.date, 'YYYY-MM-DD'),
      seller: record.user.name,
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
        date: dayjs(values.date).format('YYYY-MM-DD'),
        seller_cpf: seller,
        value: values.value
      };

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

  const handleDatePicker = (date: any) => {
    return date ? dayjs(date).format('DD/MM/YYYY') : ""; // Certifique-se de usar o formato correto para o backend
  };

  return (
    <NavbarWrapper>
      <Navbar />
      <div className="containerSl">
        <h2>Lista de Vendas</h2>
        <Row gutter={16}>
          <Col>
            <SelectProduct
              controlState={[productSelect, setProductSelect]}
              dataKey="id"
              className="fixed-height-select"
            />
          </Col>
          <Col>
            <SelectClient
              controlState={[clientSelect, setClientSelect]}
              dataKey="id"
              className="fixed-height-select"
            />
          </Col>
          <Col>
            <DatePicker
              onChange={e => { setStartDate(handleDatePicker(e)) }}
              format="DD/MM/YYYY"
              placeholder="Data de início"
              className="fixed-height-select"
            />
          </Col>
          <Col>
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
        {sales.length > 0 ? (
          <Table
            columns={columns}
            dataSource={sales}
            rowKey={'id'}
            pagination={{ defaultPageSize: 10, pageSizeOptions: [10, 20, 30] }}
            locale={customLocale}
          />
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
              <DatePicker format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item
              name="seller"
              label="Vendedor"
              rules={[{ required: true, message: 'Por favor, insira o vendedor!' }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="client"
              label="Cliente"
              rules={[{ required: true, message: 'Por favor, insira o cliente!' }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="product"
              label="Produto"
              rules={[{ required: true, message: 'Por favor, insira o produto!' }]}
            >
              <Input disabled />
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

export default ShowSalesSeller;
