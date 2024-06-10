import { useCallback, useEffect, useState } from 'react';
import { formatDateToBack } from 'util/formatters';
import { Chart } from "react-google-charts";
import './index.css'
import { DatePicker, Select, Spin, Empty } from 'antd';
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
  const [product, setProduct] = useState<string | undefined>();
  const [title, setTitle] = useState<any>('Valor vendido');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const customIndicator = <div style={{ display: 'none' }} />;

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
    legend: { position: "none" },
  });

  const fetchProducts = useCallback(async () => {
    const response = await apiInstance.get("http://localhost:8000/api/v1/products");
    setProducts(response.data.products);
  }, []);

  const getSellsPeriod = useCallback(async () => {
    setLoading(true);
    let url = "http://localhost:8000/api/v1/dashboard/date";
    const startDateFilter = startDate ? 'startDate=' + startDate : "";
    const endDateFilter = endDate ? 'endDate=' + endDate : "";
    const productFilter = product ? 'product=' + product : "";

    let queryParams = [startDateFilter, endDateFilter, productFilter];
    const query = queryParams.filter(e => e !== '').join('&');
    url += query !== "" ? "?" + query : "";

    const response = await apiInstance.get(url, {
      withCredentials: false,
    });

    setDataSells(response.data.stats);
    setLoading(false);
  }, [startDate, endDate, product]);

  useEffect(() => {
    fetchProducts();
    getSellsPeriod();
  }, [fetchProducts, getSellsPeriod]);

  useEffect(() => {
    if (dataSells.length > 0) {
      let chartData: Array<any> = [["Mês", "Valor vendido"]];
      dataSells.forEach(stat => {
        chartData.push([stat.month, stat.totalValue]);
      });
      setData(chartData);
    }
  }, [dataSells]);

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
             <DatePicker
                  placeholder="Data Inicial"
                  onChange={(date, dateString) => setStartDate(dateString)}
                />
                <DatePicker
                  placeholder="Data Final"
                  onChange={(date, dateString) => setEndDate(dateString)}
                />
                <Select
                  showSearch
                  placeholder="Selecione um produto"
                  onChange={(value) => setProduct(value)}
                  style={{ width: 200 }}
                  options={products.map((product) => ({
                    label: product.name,
                    value: product.name,
                  }))}
                />
              </div>
                  <h3>{title}</h3>
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
