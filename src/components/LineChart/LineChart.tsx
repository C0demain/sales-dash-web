import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { formatDateToBack } from 'util/formatters';
import { Chart } from "react-google-charts";
import './index.css'
import Switch from '@mui/material/Switch';

export default function BasicLineChart() {
  const [dataSells, setDataSells] = useState<any[]>([])
  const [data, setData] = useState<any[]>([["Mês", "Valor vendido"]])
  const [startDate, setStartDate] = useState<any>()
  const [endDate, setEndDate] = useState<any>()
  const [checked, setChecked] = useState(true)
  const [title, setTitle] = useState<any>('Valor vendido nos últimos 6 meses')
  const today = new Date()

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

    let queryParams = [startDateFilter, endDateFilter]
    const query = queryParams.filter(e => e !== '').join('&')
    url += query !== "&" ? "?" + query : ""

    const response = await axios.get(url, {
        withCredentials: false,
    });
    setDataSells(response.data.stats)
  }, [startDate, endDate]) 

  const setDataStats = async(event: React.ChangeEvent<HTMLInputElement>) => {
    if( data[0][1] === "Valor vendido"){
      setData([["Mês", "Quantidade vendida"],
      [`${dataSells[5]?.month}`, dataSells[5]?.totalSales],
      [`${dataSells[4]?.month}`, dataSells[4]?.totalSales],
      [`${dataSells[3]?.month}`, dataSells[3]?.totalSales],
      [`${dataSells[2]?.month}`, dataSells[2]?.totalSales],
      [`${dataSells[1]?.month}`, dataSells[1]?.totalSales],
      [`${dataSells[0]?.month}`, dataSells[0]?.totalSales],
      ])
    setTitle('Quantidade vendida nos últimos 6 meses')
    }else{
      setData([["Mês", "Valor vendido"],
      [`${dataSells[5]?.month}`, dataSells[5]?.totalValue],
      [`${dataSells[4]?.month}`, dataSells[4]?.totalValue],
      [`${dataSells[3]?.month}`, dataSells[3]?.totalValue],
      [`${dataSells[2]?.month}`, dataSells[2]?.totalValue],
      [`${dataSells[1]?.month}`, dataSells[1]?.totalValue],
      [`${dataSells[0]?.month}`, dataSells[0]?.totalValue],
      ])
    setTitle('Valor vendido nos últimos 6 meses')
    }
    setChecked(event.target.checked);
  }

  useEffect(()=>{ 
    getSellsPeriod()
  }, [getSellsPeriod])
  useEffect(()=>{
    if(dataSells.length>0){
      setData([["Mês", "Valor vendido"],
      [`${dataSells[5]?.month}`, dataSells[5]?.totalValue],
      [`${dataSells[4]?.month}`, dataSells[4]?.totalValue],
      [`${dataSells[3]?.month}`, dataSells[3]?.totalValue],
      [`${dataSells[2]?.month}`, dataSells[2]?.totalValue],
      [`${dataSells[1]?.month}`, dataSells[1]?.totalValue],
      [`${dataSells[0]?.month}`, dataSells[0]?.totalValue],
      ])
    }
  }, [getSellsPeriod, dataSells])

  return (
    <div  style={{margin: '5vh'}}>
      <div className='titleChart'>
      <Switch checked={checked} onChange={setDataStats} defaultChecked />
      <h3>{title}</h3>
      </div>
      <Chart
        chartType="LineChart"
        data={data}
        options={options}
        width="80vh"
        height="35vh"
        loader={<div>Carregando Gráfico</div>}
      />
    </div>
  );
  }