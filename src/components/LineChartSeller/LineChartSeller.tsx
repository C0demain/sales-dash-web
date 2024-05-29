import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { formatDateToBack } from 'util/formatters';
import { Chart } from "react-google-charts";
import Switch from '@mui/material/Switch';
import { Empty, Select } from 'antd';

export default function LineChartSeller() {
  const [dataSells, setDataSells] = useState<any[]>([])
  const [data, setData] = useState<any[]>([["Mês", "Valor vendido"]])
  const [startDate, setStartDate] = useState<any>()
  const [endDate, setEndDate] = useState<any>()
  const [checked, setChecked] = useState(true)
  const [title, setTitle] = useState<any>('Valor vendido')
  const [user, setUser] = useState<any>()
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
  seriesType: 'bars',
  series: [
    {type: 'bars', color: '#1976d2'},
    {type: 'line', color: '#001529'},
  ],
  legend: { position: "none" },
})

  const setDates = useCallback(async()=>{
    const year = today.getFullYear();
    const month = today.getMonth();

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

    setStartDate(formatDateToBack (startDate))
    setEndDate(formatDateToBack (today))
  },[today])

  const getSellsPeriod = useCallback(async() => {
    setDates()
    let url = "http://localhost:8000/api/v1/dashboard/date"
    const startDateFilter = startDate ? 'startDate=' + startDate : ""
    const endDateFilter = endDate ? 'endDate=' + endDate : ""
    const userFilter = user !== null ? 'userId=' + user : "";

    let queryParams = [userFilter, startDateFilter, endDateFilter]
    const query = queryParams.filter(e => e !== '').join('&')
    url += query !== "&" ? "?" + query : ""

    const response = await axios.get(url, {
        withCredentials: false,
    });
    setDataSells(response.data.stats)
  }, [startDate, endDate, user, monthDiff]) 

  const setDataStats = async(event: React.ChangeEvent<HTMLInputElement>) => {

    if( data[0][1] === "Valor vendido"){
      let chartData: Array<any> = [["Mês", "Comissão de venda", "Comissão de venda"]]
      dataSells.forEach(stat => {
        chartData.push([stat.month, stat.totalCommissionValue, stat.totalCommissionValue])
      })
      setData(chartData)
    setTitle('Comissão de venda mensal')
    }else{
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
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.id) {
        setUser(user.id);
    }
}, []);

  useEffect(()=>{ 
    getSellsPeriod()
  }, [getSellsPeriod])
  useEffect(()=>{
    if(dataSells.length>0){
      let chartData: Array<any> = [["Mês", "Valor vendido", "Valor vendido"]]
      dataSells.forEach(stat => {
        chartData.push([stat.month, stat.totalValue, stat.totalValue])
      })
      setData(chartData)
    }
  }, [getSellsPeriod, dataSells])

  return (
    <div  style={{margin: '5vh'}}>
      <div className='titleChart'>
      <Switch checked={checked} onChange={setDataStats}/>
      <h3>{title}</h3>
      <Select
        options={periodOptions}
        onSelect={setMonthDiff}
        defaultValue={5}
      />
      </div>
      { dataSells.length > 0 ?
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
  );
  }