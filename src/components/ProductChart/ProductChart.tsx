import { useCallback, useEffect, useState } from 'react';
import { Chart } from "react-google-charts";
import { Empty, Spin } from 'antd';
import { apiInstance } from 'services/api';
import Switch from '@mui/material/Switch';
import ProductSelector from 'components/ProductSelector/ProductSelector';
import { Stack } from '@mui/material';

interface Product {
  id: string;
  name: string;
}

interface MonthData {
  month: string;
  year: number;
  totalValue: number;
  totalCommissionValue: number;
  totalSales: number;
}

export default function ProductChartSeller({ startDateProp, endDateProp }: { startDateProp: string, endDateProp: string }) {
  const [dataSells, setDataSells] = useState<{ [productId: string]: MonthData[] }>({});
  const [data, setData] = useState<any[]>([["Mês", "Valor vendido"]])
  const startDate = startDateProp
  const endDate = endDateProp
  const [checked, setChecked] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const customIndicator = <div style={{ display: 'none' }} />;
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])    
  const isProductSelected = selectedProducts.length !== 0;
  const [title, setTitle] = useState<string>('Valor vendido \npor produto')
  const chartOptions = {
    colors: ["#1976d2", "#7CB9E8", "#00308F", "#b0b8ce", "#022954"],
    pointSize: 10,
    height: 350,
    animation: {
        duration: 500,
        easing: "linear",
        startup: true,
    },
    seriesType: 'bars',
    series: !isProductSelected ? [
        { type: 'bars', color: '#1976d2' },
        { type: 'line', color: '#001529' },
    ] : [],
    legend: { position: "bottom" },
};

  const getSellsPeriod = useCallback(async () => {
    setLoading(true);
    if (selectedProducts.length > 0) {
        const allProductSales = await Promise.all(selectedProducts.map(async (product) => {
            let url = "http://localhost:8000/api/v1/dashboard/date/product";
            const productFilter = `productId=${product.id}`;
            const startDateFilter = `startDate=${startDate}`;
            const endDateFilter = `endDate=${endDate}`;

            const queryParams = [productFilter, startDateFilter, endDateFilter].filter(e => e).join('&');
            url += queryParams ? `?${queryParams}` : "";
            const response = await apiInstance.get(url, { withCredentials: false });
            return { productId: product.id, data: response.data.stats };
        }));

        const productSalesMap: { [productId: string]: MonthData[] } = {};
        allProductSales.forEach(productSales => {
            productSalesMap[productSales.productId] = productSales.data;
        });

        setDataSells(productSalesMap);
    } 
    setLoading(false);
}, [selectedProducts, startDate, endDate]);

const updateChartData = useCallback(() => {
  const chartData: any[][] = [
      [
          "Mês",
          ...(isProductSelected
              ? selectedProducts.map(client => client.name)
              : (checked
                  ? ['Valor vendido mensalmente', 'Crescimento']
                  : ['Comissão de venda mensal', 'Crescimento'])
          )
      ]
  ];

  const monthSet: Set<string> = new Set();

  Object.values(dataSells).forEach(clientSales => {
      clientSales.forEach(monthData => {
          monthSet.add(monthData.month);
      });
  });
  const months = Array.from(monthSet);

  months.forEach(month => {
      const rowData: any[] = [month];

      if (selectedProducts.length > 0) {
          selectedProducts.forEach(client => {
              const clientSales = dataSells[client.id] || [];
              const monthData = clientSales.find(data => data.month === month);
              const saleValue = monthData ? (checked ? monthData.totalValue : monthData.totalCommissionValue) : 0;
              rowData.push(saleValue);
          });
      } else {
          const monthData = Object.values(dataSells)[0].find(data => data.month === month);
          const saleValue = monthData ? (checked ? monthData.totalValue : monthData.totalCommissionValue) : 0;
          rowData.push(saleValue, saleValue);
      }
      chartData.push(rowData);
  });

  setData(chartData);
}, [selectedProducts, dataSells, isProductSelected, checked]);

  const handleDataFromChild = (data: Product[]) => {
    setSelectedProducts(data);
};

const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setChecked(event.target.checked);
  setTitle(event.target.checked ? 'Valor vendido \npor produto' : 'Comissão \npor produto');
};

useEffect(() => {
  if (startDate && endDate) {
      getSellsPeriod();
  }
}, [startDate, endDate, getSellsPeriod]);

useEffect(() => {
  updateChartData();
}, [dataSells, selectedProducts, isProductSelected, updateChartData]);

  return (
    <div className='chartContainer'>
      <Spin spinning={loading} indicator={customIndicator}>
        <Stack direction={'row'} justifyContent={'space-evenly'} alignItems="center">
          <Stack direction={'row'} alignItems="center">
                <Switch checked={checked} onChange={handleSwitchChange} />
                <h3 style={{marginRight:'5vh'}}>{title}</h3>
          </Stack>
          <ProductSelector sendDataToParent={handleDataFromChild}/>
        </Stack>
        {selectedProducts.length > 0 ? (
          <Chart
            chartType="ComboChart"
            data={data}
            options={chartOptions}
            width="75vh"
            height="50vh"
            loader={<div>Carregando Gráfico</div>}
          />
        ) : (
          <Empty description='Selecione um produto' />
        )}
      </Spin>
    </div>
  );
}