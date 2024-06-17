import { useCallback, useEffect, useState } from 'react';
import { Chart } from "react-google-charts";
import './index.css';
import { Empty, Spin } from 'antd';
import { apiBackend, apiInstance } from 'services/api';

export default function BasicLineChart({ startDateProp, endDateProp, checkedProp }: { startDateProp: string, endDateProp: string, checkedProp: boolean }) {
  const [data, setData] = useState<any[]>([["Mês", "Valor vendido", "Valor vendido"]]);
  const [dataSells, setDataSells] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  const startDate = startDateProp;
  const endDate = endDateProp;
  const checked = checkedProp;
  const title = 'Vendas';

  const [options] = useState<any>({
    colors: ["#8e0152", "#276419"],
    pointSize: 10,
    animation: {
      duration: 800,
      easing: "linear",
      startup: true,
    },
    seriesType: 'bars',
    series: {
      0: { type: 'bars', color: '#1976d2' },
      1: { type: 'line', color: '#001529' },
    },
    legend: { position: "none" },
  });

  const getSellsPeriod = useCallback(async () => {
    try {
      let url = `${apiBackend}/api/v1/dashboard/date`;
      const startDateFilter = startDate ? 'startDate=' + startDate : "";
      const endDateFilter = endDate ? 'endDate=' + endDate : "";
      const queryParams = [startDateFilter, endDateFilter].filter(e => e !== '').join('&');
      url += queryParams ? "?" + queryParams : "";

      const response = await apiInstance.get(url, {
        withCredentials: false,
      });
      setDataSells(response.data.stats);
      setLoading(false);
      setDataLoaded(true);
    } catch (error) {
      console.error("Error fetching sells:", error);
      setLoading(false);
    }
  }, [startDate, endDate]);

  const setDataStats = useCallback(() => {
    const chartData: Array<any> = [["Mês", checked ? "Valor vendido" : "Comissão de venda", checked ? "Valor vendido" : "Comissão de venda"]];
    dataSells.forEach(stat => {
      chartData.push([stat.month, checked ? stat.totalValue : stat.totalCommissionValue, checked ? stat.totalValue : stat.totalCommissionValue]);
    });
    setData(chartData);
  }, [dataSells, checked]);

  useEffect(() => {
    getSellsPeriod();
  }, [getSellsPeriod]);

  useEffect(() => {
    if (dataSells.length > 0) {
      setDataStats();
    }
  }, [dataSells, checked, setDataStats]);

  // Suppress Google Charts version warning
  const originalWarn = console.warn;
  console.warn = function (...args) {
    const arg = args && args[0];
    if (arg && arg.includes('Attempting to load version \'51\' of Google Charts')) return;
    originalWarn(...args);
  };

  return (
    <div>
      <div className='titleChart'>
        <Spin spinning={loading}>
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
