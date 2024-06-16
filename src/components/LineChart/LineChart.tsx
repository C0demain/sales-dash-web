import { useCallback, useEffect, useState } from 'react';
import { formatDateToBack } from 'util/formatters';
import { Chart } from "react-google-charts";
import './index.css';
import Switch from '@mui/material/Switch';
import { Empty, Select, Spin } from 'antd';
import { apiBackend, apiInstance } from 'services/api';

interface LineChartSellerProps {
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export default function BasicLineChart({ onStartDateChange, onEndDateChange }: LineChartSellerProps) {
  const [dataSells, setDataSells] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([["Mês", "Valor vendido"]]);
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [checked, setChecked] = useState(true);
  const [title, setTitle] = useState<string>('Valor vendido');
  const [monthDiff, setMonthDiff] = useState<number>(5);
  const today = new Date();
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const customIndicator = <div style={{ display: 'none' }} />;

  const periodOptions = [
    { label: 'Últimos 12 meses', value: 11 },
    { label: 'Últimos 6 meses', value: 5 },
    { label: 'Últimos 3 meses', value: 2 },
  ];

  const options = {
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
  };

  const setDates = useCallback(() => {
    const year = today.getFullYear();
    const month = today.getMonth();
    const targetMonth = month - monthDiff;
    let targetYear = year;

    if (targetMonth < 0) {
      targetYear -= 1;
    }

    const adjustedMonth = (targetMonth + 12) % 12;
    const startDate = new Date(targetYear, adjustedMonth, 1);

    const formattedStartDate = formatDateToBack(startDate);
    const formattedEndDate = formatDateToBack(today);

    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
    onStartDateChange(formattedStartDate);
    onEndDateChange(formattedEndDate);
  }, [today, monthDiff, onStartDateChange, onEndDateChange]);

  const getSellsPeriod = useCallback(async () => {
    if (!startDate || !endDate) return;

    setLoading(true);

    let url = `${apiBackend}/api/v1/dashboard/date`;
    const startDateFilter = startDate ? `startDate=${startDate}` : "";
    const endDateFilter = endDate ? `endDate=${endDate}` : "";

    const queryParams = [startDateFilter, endDateFilter].filter(Boolean).join('&');
    if (queryParams) {
      url += `?${queryParams}`;
    }

    try {
      const response = await apiInstance.get(url, { withCredentials: false });
      setDataSells(response.data.stats);
      setDataLoaded(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  const updateChartData = useCallback(() => {
    if (dataSells.length > 0) {
      const chartData = checked
        ? [["Mês", "Valor vendido", "Valor vendido"]]
        : [["Mês", "Comissão de venda", "Comissão de venda"]];

      dataSells.forEach(stat => {
        if (checked) {
          chartData.push([stat.month, stat.totalValue, stat.totalValue]);
        } else {
          chartData.push([stat.month, stat.totalCommissionValue, stat.totalCommissionValue]);
        }
      });

      setData(chartData);
    }
  }, [dataSells, checked]);

  useEffect(() => {
    setDates();
  }, [monthDiff, setDates]);

  useEffect(() => {
    if (startDate && endDate) {
      getSellsPeriod();
    }
  }, [startDate, endDate, getSellsPeriod]);

  useEffect(() => {
    updateChartData();
  }, [dataSells, checked, updateChartData]);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    updateChartData();
    setTitle(event.target.checked ? 'Valor vendido mensalmente' : 'Comissão de venda mensal');
  };

  console.warn = function (...args) {
    const arg = args && args[0];
    if (arg && arg.includes('Attempting to load version \'51\' of Google Charts')) return;
    console.warn(...args);
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
                  <Switch checked={checked} onChange={handleSwitchChange} />
                  <h3>{title}</h3>
                  <Select
                    options={periodOptions}
                    onChange={(value) => setMonthDiff(value)}
                    defaultValue={5}
                  />
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
