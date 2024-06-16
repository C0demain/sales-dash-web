import { useCallback, useEffect, useState } from 'react';
import { formatDateToBack } from 'util/formatters';
import { Chart } from "react-google-charts";
import Switch from '@mui/material/Switch';
import { Empty, Select, Spin } from 'antd';
import { apiInstance } from 'services/api';
import { useAuth } from 'context/AuthProvider/useAuth';

export default function LineChartSeller({ startDateProp, endDateProp, checkedProp }: {startDateProp: string, endDateProp: string, checkedProp: boolean}) {
  const [dataSells, setDataSells] = useState<any[]>([])
  const [data, setData] = useState<any[]>([["Mês", "Valor vendido"]])
  const [title, setTitle] = useState<any>('Valor vendido')
  const startDate = startDateProp
  const endDate = endDateProp
  const checked = checkedProp
  const user = useAuth().id
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
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
    chartArea: {
      width: '95%', 
      height: '70%' 
    }
  });

  const getSellsPeriod = useCallback(async () => {
    let url = "http://localhost:8000/api/v1/dashboard/date";
    const startDateFilter = startDate ? `startDate=${startDate}` : "";
    const endDateFilter = endDate ? `endDate=${endDate}` : "";
    const userFilter = user ? `userId=${user}` : "";

    let queryParams = [userFilter, startDateFilter, endDateFilter];
    const query = queryParams.filter(e => e !== '').join('&');
    url += query !== "" ? `?${query}` : "";

    try {
      const response = await apiInstance.get(url, {
        withCredentials: false,
      });
      setDataSells(response.data.stats);
      setLoading(false);
      setDataLoaded(true);
    } catch (error) {
      console.error('Erro ao buscar os dados de vendas:', error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, user]);

  const setDataStats = useCallback(async () => {
    if (checked === false) {
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
  }, [checked])

  useEffect(() => {
    getSellsPeriod();
  }, [getSellsPeriod]);

  useEffect(()=>{
    setDataStats()
  }, [checked])

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
                width="60vh"
                height="35vh"
              />
            </>
          )
        ) : (
          <Spin spinning={!dataLoaded} />
        )}
      </Spin>
    </div>
  );
};
