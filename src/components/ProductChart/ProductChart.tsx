import { useCallback, useEffect, useState } from 'react';
import { Chart } from "react-google-charts";
import { Empty, Spin } from 'antd';
import { apiInstance } from 'services/api';
import SelectProduct from 'components/SelectProduct/SelectProduct';

export default function ProductChartSeller({ startDateProp, endDateProp }: { startDateProp: string, endDateProp: string }) {
  const [dataSells, setDataSells] = useState<any[]>([])
  const [data, setData] = useState<any[]>([["Mês", "Valor vendido"]])
  const startDate = startDateProp
  const endDate = endDateProp
  const [product, setProduct] = useState<number>()
  const [monthDiff, setMonthDiff] = useState<any>(5)
  const [loading, setLoading] = useState(true);
  const customIndicator = <div style={{ display: 'none' }} />;
  
  const [options] = useState<any>({
    colors: ["#8e0152", "#276419"],
    pointSize: 10,
    animation: {
      duration: 800,
      easing: "linear",
      startup: true,
    },
    seriesType: 'bars',
    series: [
      { type: 'bars', color: '#1976d2' },
      { type: 'line', color: '#001529' },
    ],
    legend: { position: "none" },
    chart: {
      title: `Vendas por mês`,
    },
  });

  const getSellsPeriod = useCallback(async () => {
    let url = "http://localhost:8000/api/v1/dashboard/date/product";

    try {
      const response = await apiInstance.get(url, {
        withCredentials: false, params:{
          startDate,
          endDate,
          productId: product
        }
      });
      setDataSells(response.data.stats);
    } catch (error) {
      console.error('Erro ao buscar os dados de vendas:', error);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, product, monthDiff]);

  useEffect(() => {
    getSellsPeriod();
  }, [getSellsPeriod]);

  useEffect(() => {
    if (dataSells.length > 0) {
      let chartData: Array<any> = [["Mês", "Valor vendido", "Valor vendido"]];
      dataSells.forEach(stat => {
        chartData.push([stat.month, stat.totalValue, stat.totalValue]);
      });
      setData(chartData);
    }
  }, [dataSells]);

  return (
    <div>
      <div className='titleChart'>
        <h3>Vendas do produto:</h3>
        <div style={{ width: '50%'}}>
          <SelectProduct controlState={[product, setProduct]} dataKey='id' />
        </div>
      </div>
      <Spin spinning={loading} indicator={customIndicator}>
        {product !== undefined ? (
          <Chart
            chartType="ComboChart"
            data={data}
            options={options}
            width="75vh"
            height="50vh"
            loader={<div>Carregando Gráfico</div>}
          />
        ) : (
          dataSells.length > 0 ? <Empty description='Selecione um produto' /> : <Empty description="Você não possui nenhum venda nesse período" />
        )}
      </Spin>
    </div>
  );
}