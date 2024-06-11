import { useCallback, useEffect, useState } from 'react';
import { formatDateToBack } from 'util/formatters';
import { Chart } from "react-google-charts";
import './index.css';
import { Switch, Select, Spin, Empty } from 'antd';
import { apiInstance } from 'services/api';

interface Product {
  id: number;
  name: string;
}

export default function BasicLineChart() {
  const [dataSells, setDataSells] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([["Mês", "Valor vendido"]]);
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [title, setTitle] = useState<any>('Valor vendido');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [groupedProducts, setGroupedProducts] = useState<Map<string, Product[]>>(new Map());
  const [monthDiff, setMonthDiff] = useState<number>(11); 
  const customIndicator = <div style={{ display: 'none' }} />;
  const today = new Date();

  const periodOptions = [
    { label: 'Últimos 12 meses', value: 11 },
    { label: 'Últimos 6 meses', value: 5 },
    { label: 'Últimos 3 meses', value: 2 },
  ];

  const [options, setOptions] = useState<any>({
    colors: ["#8e0152", "#276419"],
    pointSize: 10,
    animation: {
      duration: 800,
      easing: "linear",
      startup: true,
    },
    seriesType: 'bar',
    series: [
      { type: 'bars', color: '#1976d2' },
      { type: 'line', color: '#001529' },
    ],
    legend: { position: "bottom" },
  });

  const fetchProducts = useCallback(async () => {
    const response = await apiInstance.get("http://localhost:8000/api/v1/products/getAll");
    setProducts(response.data.products);
  }, []);

    const grouped = productsData.reduce((acc: Map<string, Product[]>, product: Product) => {
      if (!acc.has(product.name)) {
       acc.set(product.name, []);
     }
      acc.get(product.name)?.push(product);
       return acc;
     }, new Map());

    setProducts(productsData);
    setGroupedProducts(grouped);
   }, []);

  const setDates = useCallback(() => {
    const year = today.getFullYear();
    const month = today.getMonth();
    const targetMonth = month - monthDiff;
    let targetYear = year;
    if (targetMonth < 0) {
      targetYear -= 1;
    }
    const adjustedMonth = (targetMonth + 12) % 12;
    const startDate = new Date(targetYear, adjustedMonth, 1);

    setStartDate(formatDateToBack(startDate));
    setEndDate(formatDateToBack(today));
  }, [today, monthDiff]);

  const getSellsPeriod = useCallback(async () => {
    setLoading(true);
    setDates();

    let url = "http://localhost:8000/api/v1/dashboard/date";
    const startDateFilter = startDate ? 'startDate=' + startDate : "";
    const endDateFilter = endDate ? 'endDate=' + endDate : "";
    const productsFilter = selectedProducts.length > 0 ? 'products=' + selectedProducts.join(',') : "";

    let queryParams = [startDateFilter, endDateFilter, productsFilter];
    const query = queryParams.filter(e => e !== '').join('&');
    url += query !== "" ? "?" + query : "";

    const response = await apiInstance.get(url, { withCredentials: false });
    setDataSells(response.data.stats);
    setLoading(false);
  }, [startDate, endDate, selectedProducts, setDates]);

  useEffect(() => {
    fetchProducts();
    getSellsPeriod();
  }, [fetchProducts, getSellsPeriod]);

  useEffect(() => {
    if (dataSells.length > 0) {
      let chartData: Array<any> = [["Mês", ...selectedProducts.map(prod => prod)]];
      const dataMap = new Map();

      dataSells.forEach(stat => {
        if (!dataMap.has(stat.month)) {
          dataMap.set(stat.month, {});
        }
        const monthData = dataMap.get(stat.month);
        monthData[stat.productName] = stat.totalValue;
        dataMap.set(stat.month, monthData);
      });

      dataMap.forEach((value, key) => {
        const row = [key, ...selectedProducts.map(prod => value[prod] || 0)];
        chartData.push(row);
      });

      setData(chartData);
    }
  }, [dataSells, selectedProducts]);

  const originalWarn = console.warn;

  console.warn = function (...args) {
    const arg = args && args[0];
    if (arg && arg.includes('Attempting to load version \'51\' of Google Charts')) return;
    originalWarn(...args);
  };

  return (
    <div>
      <div className='titleChart'>
        <Spin spinning={loading} indicator={customIndicator}>
          {dataSells.length > 0 ? (
            <>
              <div style={{ display: 'flex-wrap', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '3vh', marginTop: '3vh', minWidth: '100%' }}>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder="Selecione produtos"
                    onChange={(values) => setSelectedProducts(values)}
                    style={{ width: 200 }}
                    options={products.map((product) => ({
                      label: product.name,
                      value: product.name,
                    }))}
                  />
                  <Select
                    style={{ marginLeft: '10px' }}
                    options={periodOptions}
                    onSelect={(value) => setMonthDiff(value)}
                    defaultValue={11}
                  />
                </div>
                <h3>{title}</h3>
              </div>
              <Chart
                chartType="ComboChart"
                data={data}
                options={options}
                width="75vh"
                height="35vh"
              />
            </>
          ) : (
            !loading && <Empty description="Não há dados registrados." />
          )}
        </Spin>
      </div>
    </div>
  );
}
