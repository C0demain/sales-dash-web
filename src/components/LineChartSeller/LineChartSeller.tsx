import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { formatDateToBack } from 'util/formatters';
import { Chart } from "react-google-charts";
import Switch from '@mui/material/Switch';
import { Empty } from 'antd';

export default function LineChartSeller() {
  const [dataSells, setDataSells] = useState<any[]>([])
  const [data, setData] = useState<any[]>([["Mês", "Valor vendido"]])
  const [startDate, setStartDate] = useState<any>()
  const [endDate, setEndDate] = useState<any>()
  const [checked, setChecked] = useState(true)
  const [title, setTitle] = useState<any>('Valor vendido nos últimos 6 meses')
  const [user, setUser] = useState<any>()
  const today = new Date()
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

  const [options, setOptions] = useState<any>({
  colors: ["#8e0152", "#276419"],
  pointSize: 10,
  animation: {
    duration: 1000,
    easing: "linear",
    startup: true,
  },
  legend: { position: "none" },
})

  const setDates = useCallback(async()=>{
    const year = today.getFullYear();
    const month = today.getMonth();

    // Calcular o mês do 5º mês passado
    const targetMonth = month - 5;

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
  }, [startDate, endDate, user]) 

  const setDataStats = async(event: React.ChangeEvent<HTMLInputElement>) => {
    
    // Completa com os meses restantes
    const cleanDataSells = Array.from(Array(12).keys(), month => {
      return dataSells.find(sell => sell.month === meses[month]) || {month: meses[month], totalCommissionValue: 0, totalValue: 0}
    })

    if( data[0][1] === "Valor vendido"){
      setData([["Mês", "Comissão de venda"],
      [`${cleanDataSells[0]?.month}`, cleanDataSells[0]?.totalCommissionValue],
      [`${cleanDataSells[1]?.month}`, cleanDataSells[1]?.totalCommissionValue],
      [`${cleanDataSells[2]?.month}`, cleanDataSells[2]?.totalCommissionValue],
      [`${cleanDataSells[3]?.month}`, cleanDataSells[3]?.totalCommissionValue],
      [`${cleanDataSells[4]?.month}`, cleanDataSells[4]?.totalCommissionValue],
      [`${cleanDataSells[5]?.month}`, cleanDataSells[5]?.totalCommissionValue],
      ])
    setTitle('Comissão nos últimos 6 meses')
    }else{
      setData([["Mês", "Valor vendido"],
      [`${cleanDataSells[0]?.month}`, cleanDataSells[0]?.totalValue],
      [`${cleanDataSells[1]?.month}`, cleanDataSells[1]?.totalValue],
      [`${cleanDataSells[2]?.month}`, cleanDataSells[2]?.totalValue],
      [`${cleanDataSells[3]?.month}`, cleanDataSells[3]?.totalValue],
      [`${cleanDataSells[4]?.month}`, cleanDataSells[4]?.totalValue],
      [`${cleanDataSells[5]?.month}`, cleanDataSells[5]?.totalValue],
      ])
    setTitle('Valor vendido nos últimos 6 meses')
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
    // Completa com os meses restantes
    const cleanDataSells = Array.from(Array(12).keys(), month => {
      return dataSells.find(sell => sell.month === meses[month]) || {month: meses[month], totalCommissionValue: 0, totalValue: 0}
    })

    if(dataSells.length>0){
      setData([["Mês", "Valor vendido"],
      [`${cleanDataSells[0]?.month}`, cleanDataSells[0]?.totalValue],
      [`${cleanDataSells[1]?.month}`, cleanDataSells[1]?.totalValue],
      [`${cleanDataSells[2]?.month}`, cleanDataSells[2]?.totalValue],
      [`${cleanDataSells[3]?.month}`, cleanDataSells[3]?.totalValue],
      [`${cleanDataSells[4]?.month}`, cleanDataSells[4]?.totalValue],
      [`${cleanDataSells[5]?.month}`, cleanDataSells[5]?.totalValue],
      ])
    }
  }, [getSellsPeriod, dataSells])

  return (
    <div  style={{margin: '5vh'}}>
      <div className='titleChart'>
      <Switch checked={checked} onChange={setDataStats} />
      <h3>{title}</h3>
      </div>
      { dataSells.length > 0 ?
      <Chart
        chartType="LineChart"
        data={data}
        options={options}
        width="80vh"
        height="35vh"
        loader={<div>Carregando Gráfico</div>}
      /> : <Empty description="Você não possui nenhum venda nos últimos 6 meses" />
      }
    </div>
  );
  }