import { useCallback, useEffect, useState } from 'react';
import { formatDateToBack } from 'util/formatters';
import { Chart } from "react-google-charts";
import Switch from '@mui/material/Switch';
import { Empty, Select } from 'antd';
import { apiInstance } from 'services/api';
import { useAuth } from 'context/AuthProvider/useAuth';
import SelectProduct from 'components/SelectProduct/SelectProduct';

export default function LineChartSeller() {
  const [dataSells, setDataSells] = useState<any[]>([])
  const [data, setData] = useState<any[]>([["Mês", "Valor vendido"]])
  const [startDate, setStartDate] = useState<any>()
  const [endDate, setEndDate] = useState<any>()
  const [product, setProduct] = useState<number>()
  const [checked, setChecked] = useState(true)
  const [title, setTitle] = useState<any>('Valor vendido')
  const [monthDiff, setMonthDiff] = useState<any>(5)
  const today = new Date()

  const periodOptions = [
    { label: 'Últimos 12 meses', value: 11 },
    { label: 'Últimos 6 meses', value: 5 },
    { label: 'Últimos 3 meses', value: 2 },
    { label: 'Mês atual', value: 0 }
  ];

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

  const setDates = useCallback(() => {
    const year = today.getFullYear();
    const month = today.getMonth();
    const targetMonth = month - monthDiff;
    let targetYear = year;

    if (targetMonth < 0) {
      targetYear -= 1;
    }

    const adjustedMonth = (targetMonth + 12) % 12;
    let startDate = new Date(targetYear, adjustedMonth, 1);

    setStartDate(formatDateToBack(startDate));
    setEndDate(formatDateToBack(today));
  }, [monthDiff, today]);

  const getSellsPeriod = useCallback(async () => {
    setDates();
    let url = "http://localhost:8000/api/v1/dashboard/date/product";

    try {
      const response = await apiInstance.get(url, {
        withCredentials: false, params:{
          startDate,
          endDate,
          productId: product
        }
      });
      console.log(response.data.stats)
      setDataSells(response.data.stats);
    } catch (error) {
      console.error('Erro ao buscar os dados de vendas:', error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, product, monthDiff]);

  const setDataStats = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (data[0][1] === "Valor vendido") {
      let chartData: Array<any> = [["Mês", "Comissão de venda", "Comissão de venda"]];
      dataSells.forEach(stat => {
        chartData.push([stat.month, stat.totalCommissionValue, stat.totalCommissionValue]);
      });
      setData(chartData);
      setTitle('Comissão de venda mensal');
    } else {
      let chartData: Array<any> = [["Mês", "Valor vendido", "Valor vendido"]];
      dataSells.forEach(stat => {
        chartData.push([stat.month, stat.totalValue, stat.totalValue]);
      });
      setData(chartData);
      setTitle('Valor vendido mensalmente');
    }
    setChecked(event.target.checked);
  }

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
        <Switch checked={checked} onChange={setDataStats} />
        <h3>{title}</h3>
        <Select
          options={periodOptions}
          onSelect={(value) => setMonthDiff(value)}
          defaultValue={5}
        />
        <SelectProduct controlState={[product, setProduct]} dataKey='id'/>
      </div>
      {dataSells.length > 0 ?
        <Chart
          chartType="ComboChart"
          data={data}
          options={options}
          width="80vh"
          height="35vh"
          loader={<div>Carregando Gráfico</div>}
        /> : <Empty description="Você não possui nenhum venda nesse período" />
      }
    </div>
  )
}
