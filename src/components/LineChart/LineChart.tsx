import { useCallback, useEffect, useState } from 'react';
import { Chart } from "react-google-charts";
import './index.css'
import { Empty, Select, Spin } from 'antd';
import { apiInstance } from 'services/api';

interface LineChartSellerProps {
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export default function BasicLineChart({ startDateProp, endDateProp, checkedProp }: { startDateProp: string, endDateProp: string, checkedProp: boolean }) {
  const [dataSells, setDataSells] = useState<any[]>([])
  const [data, setData] = useState<any[]>([["Mês", "Valor vendido"]])
  const startDate = startDateProp
  const endDate = endDateProp
  const checked = checkedProp
  const title = 'Vendas'
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const customIndicator = <div style={{ display: 'none' }} />;
  let totalQtde = 0

  const [options] = useState<any>({
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

  const getSellsPeriod = useCallback(async () => {
    let url = "http://localhost:8000/api/v1/dashboard/date"
    const startDateFilter = startDate ? 'startDate=' + startDate : ""
    const endDateFilter = endDate ? 'endDate=' + endDate : ""

    let queryParams = [startDateFilter, endDateFilter]
    const query = queryParams.filter(e => e !== '').join('&')
    url += query !== "&" ? "?" + query : ""

    const response = await apiInstance.get(url, {
      withCredentials: false,
    });
    setDataSells(response.data.stats)
    setLoading(false);
    setDataLoaded(true);  // Set dataLoaded to true once the data is successfully loaded
  }, [startDate, endDate])

  const setDataStats = useCallback(async (checked: boolean) => {
    if (checked === false) {
      let chartData: Array<any> = [["Mês", "Comissão de venda", "Comissão de venda"]]
      dataSells.forEach(stat => {
        chartData.push([stat.month, stat.totalCommissionValue, stat.totalCommissionValue])
      })
      setData(chartData)
    } else {
      let chartData: Array<any> = [["Mês", "Valor vendido", "Valor vendido"]]
      dataSells.forEach(stat => {
        chartData.push([stat.month, stat.totalValue, stat.totalValue])
      })
      setData(chartData)
    }
  },[checked])

  useEffect(() => {
    getSellsPeriod()
  }, [getSellsPeriod])

  useEffect(()=>{
    setDataStats(checked)
  }, [checked])

  useEffect(() => {
    if (dataSells.length > 0) {
      let chartData: Array<any> = [["Mês", "Valor vendido", "Valor vendido"]]
      dataSells.forEach(stat => {
        totalQtde = + stat.totalValue
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
        <Spin spinning={loading} indicator={customIndicator}>
          {dataLoaded ? (
            dataSells.length === 0 ? (
              <Empty description="Nenhuma comissão encontrada" />
            ) : (
              <>
                <div className='titleChart'>
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
            )
          ) : null}
        </Spin>
      </div>
    </div>
  );  
}