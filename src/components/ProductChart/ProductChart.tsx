import { useCallback, useEffect, useState } from 'react';
import { formatDateToBack } from 'util/formatters';
import { Chart } from "react-google-charts";
import Switch from '@mui/material/Switch';
import { Empty, Select } from 'antd';
import { apiInstance } from 'services/api';
import SelectProduct from 'components/SelectProduct/SelectProduct';

export default function LineChartSeller({ startDateProp, endDateProp }: { startDateProp: string, endDateProp: string }) {
  const [dataSells, setDataSells] = useState<any[]>([])
  const [data, setData] = useState<any[]>([["Mês", "Valor vendido"]])
  const startDate = startDateProp
  const endDate = endDateProp
  const [product, setProduct] = useState<number>()
  const [checked, setChecked] = useState(true)
  const [title, setTitle] = useState<any>('Vendas do produto:')
  const [monthDiff, setMonthDiff] = useState<any>(5)

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
          <h3>{title}</h3>
        <div style={{width: '30%'}}>
        <SelectProduct controlState={[product, setProduct]} dataKey='id'/>
        </div>
      </div>
      {product!=undefined ?
        <Chart
          chartType="ComboChart"
          data={data}
          options={options}
          width="75vh"
          height="35vh"
          loader={<div>Carregando Gráfico</div>}
        /> : dataSells.length>0?<Empty description='Selecione um produto'/>: <Empty description="Você não possui nenhum venda nesse período" />
      }
    </div>
  )
}
