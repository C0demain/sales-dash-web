import { useCallback, useEffect, useState } from 'react';
import { formatDateToBack } from 'util/formatters';
import { Chart } from "react-google-charts";
import './index.css'
import Switch from '@mui/material/Switch';
import { Empty, Select } from 'antd';
import { apiInstance } from 'services/api';

export default function BasicLineChart() {
  const [dataSells, setDataSells] = useState<any[]>([])
  const [data, setData] = useState<any[]>([["Mês", "Valor vendido"]])
  const [startDate, setStartDate] = useState<any>()
  const [endDate, setEndDate] = useState<any>()
  const [checked, setChecked] = useState(true)
  const [title, setTitle] = useState<any>('Valor vendido')
  const [monthDiff, setMonthDiff] = useState<any>(5)
  const today = new Date()
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

  const periodOptions = [
    {
      label: 'Últimos 12 meses',
      value: 11
    },
    {
      label: 'Últimos 6 meses',
      value: 5
    },
    {
      label: 'Últimos 3 meses',
      value: 2
    },
  ]

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
  })

  const setDates = useCallback(async () => {
    const year = today.getFullYear();
    const month = today.getMonth();

    // Calcular o mês do 5º mês passado
    const targetMonth = month - monthDiff;

    // Verificar se precisa ajustar o ano
    let targetYear = year;
    if (targetMonth < 0) {
      targetYear -= 1;
    }

    // Obter o mês ajustado dentro do intervalo [0, 11]
    const adjustedMonth = (targetMonth + 12) % 12;

    // Retornar o primeiro dia do mês desejado
    let startDate = new Date(targetYear, adjustedMonth, 1);

    setStartDate(formatDateToBack(startDate))
    setEndDate(formatDateToBack(today))
  }, [today])

  const getSellsPeriod = useCallback(async () => {
    setDates()
    let url = "http://localhost:8000/api/v1/dashboard/date"
    const startDateFilter = startDate ? 'startDate=' + startDate : ""
    const endDateFilter = endDate ? 'endDate=' + endDate : ""

    let queryParams = [startDateFilter, endDateFilter]
    const query = queryParams.filter(e => e !== '').join('&')
    url += query !== "&" ? "?" + query : ""

    const response = await apiInstance.get(url, {
      withCredentials: false,
    });
    //console.log(url)
    setDataSells(response.data.stats)
  }, [startDate, endDate, monthDiff])

  const setDataStats = async (event: React.ChangeEvent<HTMLInputElement>) => {

    // Completa com os meses restantes

    if (data[0][1] === "Valor vendido") {
      let chartData: Array<any> = [["Mês", "Comissão de venda", "Comissão de venda"]]
      dataSells.forEach(stat => {
        chartData.push([stat.month, stat.totalCommissionValue, stat.totalCommissionValue])
      })
      setData(chartData)
      setTitle('Comissão de venda mensal')
    } else {
      let chartData: Array<any> = [["Mês", "Valor vendido", "Valor vendido"]]
      dataSells.forEach(stat => {
        chartData.push([stat.month, stat.totalValue, stat.totalValue])
      })
      setData(chartData)
      setTitle('Valor vendido mensalmente')
    }
    setChecked(event.target.checked);
  }

  useEffect(() => {
    getSellsPeriod()
  }, [getSellsPeriod])

  useEffect(() => {
    if (dataSells.length > 0) {
      let chartData: Array<any> = [["Mês", "Valor vendido", "Valor vendido"]]
      dataSells.forEach(stat => {
        chartData.push([stat.month, stat.totalValue, stat.totalValue])
      })
      setData(chartData)
    }
  }, [getSellsPeriod, dataSells])

  const originalWarn = console.warn;

  console.warn = function (...args) {
    const arg = args && args[0];

    if (arg && arg.includes('Attempting to load version \'51\' of Google Charts')) return;

    originalWarn(...args);
  };

  return (
    <div>
      <div className='titleChart'>
        <Switch checked={checked} onChange={setDataStats} />
        <h3>{title}</h3>
        <Select
          options={periodOptions}
          onSelect={setMonthDiff}
          defaultValue={5}
        />
      </div>
      {dataSells.length > 0 ?
        <Chart
          chartType="ComboChart"
          data={data}
          options={options}
          width="75vh"
          height="35vh"
          loader={<div>Carregando Gráfico</div>}
        /> : <Empty description="Não foi registrada nenhum venda nesse período" />
      }
    </div>
  );
}