import Switch from '@mui/material/Switch';
import { Empty, Spin } from 'antd';
import ClientSelector from 'components/ClientSelector/ClientSelector';
import { useCallback, useEffect, useState } from 'react';
import { Chart } from "react-google-charts";
import { apiBackend, apiInstance } from 'services/api';
import './index.css';
import { Stack } from '@mui/material';

interface Client {
  id: string;
  name: string;
  segment: string;
  cpf: string;
}

interface MonthData {
  month: string;
  year: number;
  totalValue: number;
  totalCommissionValue: number;
  totalSales: number;
}

export default function ClientSalesChart({ startDateProp, endDateProp }: { startDateProp: string, endDateProp: string }) {
  const [dataSells, setDataSells] = useState<{ [clientId: string]: MonthData[] }>({});
  const [data, setData] = useState<any[][]>([["Mês"]]);
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const startDate = startDateProp;
  const endDate = endDateProp;
  const [checked, setChecked] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('Valor vendido por clientes');
  const [loading, setLoading] = useState<boolean>(true);
  const customIndicator = <div style={{ display: 'none' }} />;
  const isClientSelected = selectedClients.length !== 0;

  const chartOptions = {
    colors: ["#1976d2", "#7CB9E8", "#00308F", "#b0b8ce", "#022954"],
    pointSize: 10,
    height: 350,
    animation: {
      duration: 500,
      easing: "linear",
      startup: true,
    },
    seriesType: 'bars',
    series: !isClientSelected ? [
      { type: 'bars', color: '#1976d2' },
      { type: 'line', color: '#001529' },
    ] : [],
    legend: { position: "bottom" },
  };

  const getSellsPeriod = useCallback(async () => {
    setLoading(true);
    if (selectedClients.length > 0) {
      const allClientsSales = await Promise.all(selectedClients.map(async (client) => {
        let url = `${apiBackend}/api/v1/dashboard/date/client`;
        const clientFilter = `clientId=${client.id}`;
        const startDateFilter = `startDate=${startDate}`;
        const endDateFilter = `endDate=${endDate}`;

        const queryParams = [clientFilter, startDateFilter, endDateFilter].filter(e => e).join('&');
        url += queryParams ? `?${queryParams}` : "";
        const response = await apiInstance.get(url, { withCredentials: false });
        return { clientId: client.id, data: response.data.stats };
      }));

      const clientSalesMap: { [clientId: string]: MonthData[] } = {};
      allClientsSales.forEach(clientSales => {
        clientSalesMap[clientSales.clientId] = clientSales.data;
      });

      setDataSells(clientSalesMap);
    } else {
      let url = `${apiBackend}/api/v1/dashboard/date/client`;
      const startDateFilter = `startDate=${startDate}`;
      const endDateFilter = `endDate=${endDate}`;

      const queryParams = [startDateFilter, endDateFilter].filter(e => e).join('&');
      url += queryParams ? `?${queryParams}` : "";
      const response = await apiInstance.get(url, { withCredentials: false });
      setDataSells({ all: response.data.stats });
    }
    setLoading(false);
  }, [selectedClients, startDate, endDate]);

  const updateChartData = useCallback(() => {
    const chartData: any[][] = [
      [
        "Mês",
        ...(isClientSelected
          ? selectedClients.map(client => client.name)
          : (checked
            ? ['Valor vendido mensalmente', 'Crescimento']
            : ['Comissão de venda mensal', 'Crescimento'])
        )
      ]
    ];

    const monthSet: Set<string> = new Set();

    Object.values(dataSells).forEach(clientSales => {
      clientSales.forEach(monthData => {
        monthSet.add(monthData.month);
      });
    });
    const months = Array.from(monthSet);

    months.forEach(month => {
      const rowData: any[] = [month];

      if (selectedClients.length > 0) {
        selectedClients.forEach(client => {
          const clientSales = dataSells[client.id] || [];
          const monthData = clientSales.find(data => data.month === month);
          const saleValue = monthData ? (checked ? monthData.totalValue : monthData.totalCommissionValue) : 0;
          rowData.push(saleValue);
        });
      } else {
        const monthData = Object.values(dataSells)[0].find(data => data.month === month);
        const saleValue = monthData ? (checked ? monthData.totalValue : monthData.totalCommissionValue) : 0;
        rowData.push(saleValue, saleValue);
      }
      chartData.push(rowData);
    });

    setData(chartData);
  }, [selectedClients, dataSells, checked, isClientSelected]);

  const handleDataFromChild = (data: Client[]) => {
    setSelectedClients(data);
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setTitle(event.target.checked ? 'Valor vendido \npor clientes' : 'Comissão \npor cliente');
  };

  useEffect(() => {
    if (startDate && endDate) {
      getSellsPeriod();
    }
  }, [startDate, endDate, getSellsPeriod]);

  useEffect(() => {
    updateChartData();
  }, [dataSells, checked, selectedClients, isClientSelected, updateChartData]);

  console.warn = (...args: any[]) => {
    if (args[0] && args[0].includes('Attempting to load version \'51\' of Google Charts')) return;
    console.warn(...args);
  };

  return (
    <div className='chartContainer'>
      <Spin spinning={loading}>
        {Object.keys(dataSells).length > 0 ? (
          <>
            <Stack direction={'row'} justifyContent={'space-evenly'} alignItems="center">
              <Stack direction={'row'} alignItems="center">
                <Switch checked={checked} onChange={handleSwitchChange} />
                <h3 style={{ marginRight: '2vh' }}>{title}</h3>
              </Stack>
              <ClientSelector sendDataToParent={handleDataFromChild} />
            </Stack>
            {selectedClients.length > 0 ? (
              <div className='chartWrapper'>
                <Chart
                  chartType="ComboChart"
                  data={data}
                  options={chartOptions}
                  width="75vh"
                  height="50vh"
                />
              </div>
            ) : (
              <Empty description='Selecione um ou mais clientes.' />
            )}
          </>
        ) : (
          !loading && <Empty description="Não há comissões registradas." />
        )}
      </Spin>
    </div>
  );
}
